import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/auto-toggle', authenticate, async (req: AuthRequest, res) => {
  const { enabled } = req.body;
  // In production, update user settings in DB and notify AutoTradingService
  res.json({ success: true, enabled });
});

router.post('/settings', authenticate, async (req: AuthRequest, res) => {
  // Save risk settings to user's settings JSONB
  res.json({ success: true });
});

router.get('/signals', authenticate, async (req: AuthRequest, res) => {
  // Return recent signals for the user
  res.json({ signals: [] });
});

export default router;
