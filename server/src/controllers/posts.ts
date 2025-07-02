import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { handlePostTags } from "../utils/tagHelpers";

const postZodSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
});

export const voteZodSchema = z.object({
    vote: z.number().min(-1).max(1),
});

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: true,
        },
    });

    res.json({
        posts: posts,
    });
});

const createNewPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const response = postZodSchema.safeParse(req.body);

    if (!response.success) {
        throw new AppError("Invalid inputs", 400);
    }

    const newPost = await prisma.post.create({
        data: {
            userId: req.user!.id,
            title: response.data.title,
            content: response.data.content,
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: true,
        },
    });
    let postWithTags = null;

    if (response.data.tags && response.data.tags.length !== 0) {
        postWithTags = await handlePostTags(newPost.id, response.data.tags);
    }

    const responsePost = postWithTags ?? newPost;

    res.status(201).json({
        msg: "Post has been created!",
        newPost: responsePost,
    });
});

const getAllPostsOfUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany({
        where: {
            userId: req.user!.id,
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    res.json({
        user: {
            id: req.user!.id,
            username: req.user!.username,
            displayName: req.user!.displayName,
            email: req.user!.email,
        },
        posts: posts,
    });
});

const getPostsOfFollowingUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id,
            },
            select: {
                username: true,
                following: {
                    select: {
                        following: {
                            select: {
                                username: true,
                                displayName: true,
                                posts: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new AppError("User not found", 400);
        }
        res.json({
            username: user.username,
            following: user.following.map((f) => f.following),
        });
    }
);

const getPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
        where: {
            id: id,
        },
        select: {
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
                                    vote: true,
                                },
                            },
                        },
                    },
                    commentVotes: {
                        select: {
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
                    vote: true,
                },
            },
        },
    });

    if (!post) {
        throw new AppError("Post not found", 400);
    }

    const userVote = await prisma.postVote.findUnique({
        where: {
            userId_postId: {
                postId: post.id,
                userId: req.user!.id,
            },
        },
    });

    res.json({
        userVote: userVote,
        post: {
            ...post,
            comments: post?.comments.map((comment) => {
                return {
                    ...comment,
                    replies: comment.replies.map((reply) => {
                        return {
                            ...reply,
                            numberOfReplies: reply.replies.length,
                            commentVotes: comment.commentVotes.reduce(
                                (totalVotes, vote) => {
                                    if (vote.vote === 1) {
                                        return {
                                            ...totalVotes,
                                            upvotes: totalVotes.upvotes + 1,
                                        };
                                    } else if (vote.vote === -1) {
                                        return {
                                            ...totalVotes,
                                            downvotes: totalVotes.downvotes - 1,
                                        };
                                    } else {
                                        return totalVotes;
                                    }
                                },
                                {
                                    upvotes: 0,
                                    downvotes: 0,
                                }
                            ),
                        };
                    }),
                    commentVotes: comment.commentVotes.reduce(
                        (totalVotes, vote) => {
                            if (vote.vote === 1) {
                                return {
                                    ...totalVotes,
                                    upvotes: totalVotes.upvotes + 1,
                                };
                            } else if (vote.vote === -1) {
                                return {
                                    ...totalVotes,
                                    downvotes: totalVotes.downvotes - 1,
                                };
                            } else {
                                return totalVotes;
                            }
                        },
                        {
                            upvotes: 0,
                            downvotes: 0,
                        }
                    ),
                };
            }),
            postTags: post?.postTags.map((t) => t.tag),
            postVotes: post?.postVotes.reduce(
                (totalVotes, vote) => {
                    if (vote.vote === 1) {
                        return {
                            ...totalVotes,
                            upvotes: totalVotes.upvotes + 1,
                        };
                    } else if (vote.vote === -1) {
                        return {
                            ...totalVotes,
                            downvotes: totalVotes.downvotes - 1,
                        };
                    } else {
                        return totalVotes;
                    }
                },
                {
                    upvotes: 0,
                    downvotes: 0,
                }
            ),
        },
    });
});

const editPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const response = postZodSchema.safeParse(req.body);
    const { id } = req.params;
    if (!response.success) {
        res.status(400).json({
            error: response.error.format(),
        });
    } else {
        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
        });

        if (!post) {
            throw new AppError("Post not found", 400);
        } else if (post.userId !== req.user!.id) {
            throw new AppError("Unauthorized, cannot edit someone else's post", 403);
        }

        const updatedPost = await prisma.post.update({
            where: {
                id: id,
                userId: req.user!.id,
            },
            data: {
                title: response.data.title,
                content: response.data.content,
            },
        });

        let postWithTags = null;

        if (response.data.tags && response.data.tags.length !== 0) {
            postWithTags = await handlePostTags(updatedPost.id, response.data.tags);
        }

        const responsePost = postWithTags ?? updatedPost;

        res.json({
            msg: "Post has been updated!",
            updatedPost: responsePost,
        });
    }
});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
        where: {
            id: id,
        },
    });

    if (!post) {
        throw new AppError("Post not found", 400);
    } else if (post.userId !== req.user!.id) {
        throw new AppError("Unauthorized, cannot delete someone else's post", 403);
    }

    const allPostComments = await prisma.comment.findMany({
        where: {
            postId: post.id,
        },
    });
    const allPostCommentsId = allPostComments.map((comment) => comment.id);

    const deletedPost = await prisma.$transaction(async (tx) => {
        await tx.postTag.deleteMany({
            where: {
                postId: post.id,
            },
        });

        await tx.commentVote.deleteMany({
            where: {
                commentId: {
                    in: allPostCommentsId,
                },
            },
        });
        await tx.postVote.deleteMany({
            where: {
                postId: post.id,
            },
        });
        await tx.comment.deleteMany({
            where: {
                postId: post.id,
            },
        });

        const deleted = await tx.post.delete({
            where: {
                id: id,
                userId: req.user!.id,
            },
        });

        return deleted;
    });

    res.json({
        msg: "Deleted the post successfully",
        post: deletedPost,
    });
});

const voteOnPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedResponse = voteZodSchema.safeParse(req.body);
    if (!parsedResponse.success) {
        throw new AppError(
            JSON.stringify({
                msg: "Invalid inputs recieved.",
                error: parsedResponse.error.format(),
            }),
            400
        );
    }

    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
        throw new AppError("Post does not exist.", 400);
    }

    const votedPost = await prisma.postVote.upsert({
        where: {
            userId_postId: {
                postId: post.id,
                userId: req.user!.id,
            },
        },
        update: { vote: parsedResponse.data.vote },
        create: {
            postId: post.id,
            userId: req.user!.id,
            vote: parsedResponse.data.vote,
        },
    });

    res.json({
        msg: "Vote has been updated",
        vote: votedPost,
    });
});

export {
    getAllPosts,
    createNewPost,
    getPost,
    editPost,
    deletePost,
    voteOnPost,
    getPostsOfFollowingUsers,
    getAllPostsOfUser,
};
