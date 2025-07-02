import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
    followUser,
    getUserFollowers,
    getUserFollowing,
    unFollowUser,
} from "../controllers/follows";

const followRoutes = Router();

// prefix url: /

followRoutes.route("/following").get(isAuthenticated, getUserFollowing);
followRoutes.route("/followers").get(isAuthenticated, getUserFollowers);

followRoutes.route("/:userId/follow").post(isAuthenticated, followUser);
followRoutes.route("/:userId/unfollow").post(isAuthenticated, unFollowUser);

export { followRoutes };
