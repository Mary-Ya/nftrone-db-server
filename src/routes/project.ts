import { Router } from "express";
import { getProjects, postProjects } from "~/controllers/projects";
import { buildExpressCallback } from "~/helpers/express-callback";

const router = Router();

router.get("/", buildExpressCallback(getProjects));
router.post("/", buildExpressCallback(postProjects));

export default router;