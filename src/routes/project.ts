import { Router } from "express";
import { buildExpressCallback } from "../helpers/express-callback";


const router = Router();

router.get("/", buildExpressCallback(getProjects));
router.post("/", buildExpressCallback(createProject));

export default router;