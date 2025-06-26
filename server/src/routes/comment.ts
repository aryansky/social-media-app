import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  commentOnPost,
  deleteCommentOnPost,
  editCommentOnPost,
  getUserComments,
  voteOnComment,
} from "../controllers/comments";

const commentRoutes = Router();

// prefix url: /comments

commentRoutes.route("/").get(isAuthenticated, getUserComments);

commentRoutes.route("/:postId").post(isAuthenticated, commentOnPost);

commentRoutes
  .route("/:commentId")
  .put(isAuthenticated, editCommentOnPost)
  .delete(isAuthenticated, deleteCommentOnPost);

commentRoutes.route("/:commentId/votes").post(isAuthenticated, voteOnComment);

export { commentRoutes };
