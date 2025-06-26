import { Router } from "express";
import {
  createNewPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
  voteOnPost,
} from "../controllers/posts";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const postRoutes = Router();

// prefix url: /posts

postRoutes
  .route("/")
  .get(isAuthenticated, getAllPosts)
  .post(isAuthenticated, createNewPost);

postRoutes
  .route("/:id")
  .get(isAuthenticated, getPost)
  .put(isAuthenticated, editPost)
  .delete(isAuthenticated, deletePost);

postRoutes.route("/:id/votes").post(isAuthenticated, voteOnPost);

export { postRoutes };
