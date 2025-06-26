import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const postZodSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const voteZodSchema = z.object({
  vote: z.number().min(-1).max(1),
});

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany();

    res.json({
      posts: posts,
    });
  }
);

const createNewPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = postZodSchema.safeParse(req.body);

    if (!response.success) {
      res.status(400).json({
        error: response.error,
      });
    } else {
      const newPost = await prisma.post.create({
        data: {
          userId: req.user!.id,
          title: response.data.title,
          content: response.data.content,
        },
      });

      res.json({
        msg: "Post has been created!",
        newPost: newPost,
      });
    }
  }
);

const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
        comments: {
          where: {
            parentCommentId: null,
          },
          include: {
            replies: {
              include: {
                commentVotes: true,
              },
            },
            commentVotes: true,
          },
        },
        postTags: true,
        postVotes: true,
      },
    });

    res.json({
      post: post,
    });
  }
);

const editPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = postZodSchema.safeParse(req.body);
    const { id } = req.params;
    if (!response.success) {
      res.status(400).json({
        error: response.error,
      });
    } else {
      // Update function in prisma will throw an error if no post id found.
      const updatedPost = await prisma.post.update({
        where: {
          id: id,
          userId: req.user!.id,
        },
        data: {
          userId: req.user!.id,
          title: response.data.title,
          content: response.data.content,
        },
      });

      res.json({
        msg: "Post has been updated!",
        newPost: updatedPost,
      });
    }
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedPost = await prisma.post.delete({
      where: {
        id: id,
        userId: req.user!.id,
      },
    });

    res.json({
      msg: "Deleted the post successfully",
      post: deletedPost,
    });
  }
);

const voteOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    const votedPost = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          postId: post.id,
          userId: req.user!.id,
        },
      },
    });

    if (votedPost) {
      const vote = await prisma.postVote.update({
        where: { id: votedPost.id },
        data: { vote: parsedResponse.data.vote },
      });

      res.json({
        msg: "Vote has been updated",
        vote: vote,
      });
    } else {
      const vote = await prisma.postVote.create({
        data: {
          postId: post.id,
          userId: req.user!.id,
          vote: parsedResponse.data.vote,
        },
      });
      res.json({
        msg: "Vote has been created",
        vote: vote,
      });
    }
  }
);

export {
  getAllPosts,
  createNewPost,
  getPost,
  editPost,
  deletePost,
  voteOnPost,
};
