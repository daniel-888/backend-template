import { Router } from "express";
import { IPv4List } from "../../../controllers/tools/lookup.controller";

const router: Router = Router();

router.get("/", IPv4List);

export default router;
