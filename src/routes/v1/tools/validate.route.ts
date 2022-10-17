import { Router } from "express";
import { DoValidate } from "../../../controllers/tools/validate.controller";

const router: Router = Router();

router.post("/", DoValidate);

export default router;
