import { Prisma } from "@prisma/client";
import { findUserVote, voteTally } from "./voteSerializers";

export const getPostSelectOptions = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    user: true,
    comments: {
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: true,
            replies: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                    user: true,
                    replies: {
                        select: {
                            id: true,
                        },
                    },
                    commentVotes: {
                        select: {
                            userId: true,
                            vote: true,
                        },
                    },
                },
            },
            commentVotes: {
                select: {
                    userId: true,
                    vote: true,
                },
            },
        },
    },
    postTags: {
        select: {
            tag: true,
        },
    },
    postVotes: {
        select: {
            userId: true,
            vote: true,
        },
    },
};

type PostWithRelations = Prisma.PostGetPayload<{
    select: typeof getPostSelectOptions;
}>;

export const getPostSerializer = (post: PostWithRelations, user: Express.User) => {
    return {
        userVote: findUserVote(post.postVotes, user),
        post: {
            ...post,
            comments: post.comments.map((comment) => {
                return {
                    ...comment,
                    replies: comment.replies.map((reply) => {
                        return {
                            ...reply,
                            numberOfReplies: reply.replies.length,
                            userVote: findUserVote(comment.commentVotes, user),
                            commentVotes: voteTally(comment.commentVotes),
                        };
                    }),
                    userVote: findUserVote(comment.commentVotes, user),
                    commentVotes: voteTally(comment.commentVotes),
                };
            }),
            postTags: post.postTags.map((t) => t.tag),
            postVotes: voteTally(post?.postVotes),
        },
    };
};
