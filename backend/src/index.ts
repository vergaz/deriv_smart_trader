import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import derivRoutes from './routes/deriv.routes';
import tradingRoutes from './routes/trading.routes';
import analyticsRoutes from './routes/analytics.routes';
import { MarketScannerService } from './services/MarketScannerService';
import { AutoTradingService } from './services/AutoTradingService';
import { RiskManagementService } from './services/RiskManagementService';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deriv', derivRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and services
AppDataSource.initialize().then(async () => {
  console.log('✅ Database connected');
  
  const riskManagement = new RiskManagementService();
  const marketScanner = new MarketScannerService(io);
  const autoTrading = new AutoTradingService(marketScanner, riskManagement, io);
  
  // Start market scanner
  await marketScanner.start();
  console.log('✅ Market scanner started');
  
  // Start auto-trading
  autoTrading.start();
  console.log('✅ Auto-trading service started');
  
  console.log(`🚀 Deriv Smart Trader Pro running on port ${process.env.PORT || 5000}`);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export { io };
