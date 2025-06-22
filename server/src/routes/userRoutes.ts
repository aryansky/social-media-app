import { Request, Response, Router } from "express";

const userRoutes = Router();

userRoutes.get("signin", (req: Request, res: Response) => {
  // code
});

userRoutes.get("signup", (req: Request, res: Response) => {
  // code
});

export { userRoutes };
