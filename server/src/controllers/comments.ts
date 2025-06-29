import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../utils/prisma";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { voteZodSchema } from "./posts";

const commentZodSchema = z.object({
  content: z.string().nonempty(),
  parentCommentId: z.string().optional(),
});

const getUserComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await prisma.comment.findMany({
      where: {
        userId: req.user!.id,
      },
    });

    res.json({
      comments: comments,
    });
  }
);

const commentOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedResponse = commentZodSchema.safeParse(req.body);
    const { postId } = req.params;
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (post && parsedResponse.success) {
      if (parsedResponse.data.parentCommentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: parsedResponse.data.parentCommentId },
        });

        if (!parentComment) {
          throw new AppError("Parent comment does not exist", 400);
        }
      }

      const commentData = {
        postId: post.id,
        userId: req.user!.id,
        content: parsedResponse.data.content,
        parentCommentId: parsedResponse.data.parentCommentId ?? undefined,
      };

      const comment = await prisma.comment.create({
        data: commentData,
      });

      res.json({
        msg: "Comment created successfully",
        comment: comment,
      });
    } else {
      res.status(400).json({
        msg: "No post found with that postId",
      });
    }
  }
);

const editCommentOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedResponse = commentZodSchema.safeParse(req.body);
    const { commentId } = req.params;

    if (parsedResponse.success) {
      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
          userId: req.user!.id,
        },
        data: {
          content: parsedResponse.data.content,
        },
      });

      res.json({
        msg: "Comment successfully updated",
        updatedComment: updatedComment,
      });
    } else {
      res.status(400).json({
        msg: "Invalid input",
        errors: parsedResponse.error.format(),
      });
    }
  }
);
const deleteCommentOnPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
        userId: req.user!.id,
      },
    });

    res.json({
      msg: "Comment has been deleted",
      deletedComment: deletedComment,
    });
  }
);

const voteOnComment = catchAsync(
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

    const { commentId } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new AppError("Comment does not exist.", 400);
    }

    const votedComment = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          commentId: comment.id,
          userId: req.user!.id,
        },
      },
    });

    if (votedComment) {
      const vote = await prisma.commentVote.update({
        where: { id: votedComment.id },
        data: { vote: parsedResponse.data.vote },
      });

      res.json({
        msg: "Comment vote has been updated",
        vote: vote,
      });
    } else {
      const vote = await prisma.commentVote.create({
        data: {
          commentId: comment.id,
          userId: req.user!.id,
          vote: parsedResponse.data.vote,
        },
      });
      res.json({
        msg: "Comment vote has been created",
        vote: vote,
      });
    }
  }
);

export {
  getUserComments,
  commentOnPost,
  editCommentOnPost,
  deleteCommentOnPost,
  voteOnComment,
};
