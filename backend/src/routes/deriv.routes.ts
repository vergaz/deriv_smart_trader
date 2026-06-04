import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/connect', authenticate, async (req: AuthRequest, res) => {
  // OAuth flow or token exchange
  res.json({ message: 'Account connected' });
});

router.get('/balance', authenticate, async (req: AuthRequest, res) => {
  res.json({ balance: 10000, equity: 10250 });
});

router.get('/positions', authenticate, async (req: AuthRequest, res) => {
  res.json({ positions: [] });
});

export default router;
