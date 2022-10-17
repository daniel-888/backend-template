import { Router, Request, Response, NextFunction } from 'express';
import toolsRouter from './tools';
import historyRouter from './history.route';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: 'This is router v1.'})
});

router.use('/history', historyRouter);

router.use('/tools', toolsRouter);

export default router;