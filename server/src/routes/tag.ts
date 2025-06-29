import { Router } from "express";
import { getAllTags } from "../controllers/tags";

const tagRoutes = Router();

// prefix url: /tags

tagRoutes.route("/").get(getAllTags);

export { tagRoutes };
