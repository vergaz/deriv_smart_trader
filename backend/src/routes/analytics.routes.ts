import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/performance', authenticate, async (req: AuthRequest, res) => {
  res.json({
    totalTrades: 142,
    winRate: 67.6,
    profitFactor: 1.82,
    maxDrawdown: 12.5
  });
});

export default router;
