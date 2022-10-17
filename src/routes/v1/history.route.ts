import { Router } from "express";
import { list } from '../../controllers/history.controller';

const router: Router = Router();

router.get('/', list)

export default router;