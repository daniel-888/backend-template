import { Router } from "express";
import validateRouter from './validate.route';
import lookupRouter from "./lookup.route";

const router: Router = Router();

router.use('/lookup', lookupRouter);
router.use('/validate', validateRouter);

export default router;
