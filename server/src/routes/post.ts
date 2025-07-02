import { Router } from "express";
import {
    createNewPost,
    deletePost,
    editPost,
    getAllPosts,
    getPost,
    getPostsOfFollowingUsers,
    voteOnPost,
    getAllPostsOfUser,
} from "../controllers/posts";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const postRoutes = Router();

// prefix url: /posts

postRoutes
    .route("/")
    .get(isAuthenticated, getAllPostsOfUser)
    .post(isAuthenticated, createNewPost);

postRoutes.route("/all").get(isAuthenticated, getAllPosts);

postRoutes.route("/following").get(isAuthenticated, getPostsOfFollowingUsers);

postRoutes
    .route("/:id")
    .get(isAuthenticated, getPost)
    .put(isAuthenticated, editPost)
    .delete(isAuthenticated, deletePost);

postRoutes.route("/:id/votes").post(isAuthenticated, voteOnPost);

export { postRoutes };
