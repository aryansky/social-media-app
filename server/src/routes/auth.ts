import { Router } from "express";
import "../auth/passport";
import passport from "passport";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createNewUser } from "../controllers/auth";

const authRoutes = Router();

// prefix url: /auth

authRoutes.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

authRoutes.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: process.env.FRONTENDLOGINPAGE || "/",
        successRedirect: process.env.FRONTENDDASHBOARD || "/",
    })
);

authRoutes.post("/logout", isAuthenticated, async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

authRoutes.post(
    "/credentials",
    passport.authenticate("local", {
        failureRedirect: process.env.FRONTENDLOGINPAGE || "/",
        successRedirect: process.env.FRONTENDDASHBOARD || "/",
    })
);

authRoutes.post("/signup", createNewUser);

export { authRoutes };
