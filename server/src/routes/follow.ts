import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
    followUser,
    getUserFollowers,
    getUserFollowing,
    unFollowUser,
} from "../controllers/follows";

const followRoutes = Router();

// prefix url: /:userId

followRoutes.route("/following").get(isAuthenticated, getUserFollowing);
followRoutes.route("/followers").get(isAuthenticated, getUserFollowers);

followRoutes.route("/follow").post(isAuthenticated, followUser);
followRoutes.route("/unfollow").post(isAuthenticated, unFollowUser);

export { followRoutes };
