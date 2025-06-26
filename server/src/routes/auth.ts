import { Request, Response, Router } from "express";
import "../auth/passport";
import passport from "passport";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const authRoutes = Router();

authRoutes.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTENDLOGINPAGE || "/",
    successRedirect: process.env.FRONTENDDASHBOARD || "/",
  })
);

authRoutes.post("/auth/logout", isAuthenticated, async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// authRoutes.get("/auth/credentials", (req: Request, res: Response) => {
//   // code
// });

export { authRoutes };
