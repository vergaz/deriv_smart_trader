import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('signals')
export class Signal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.signals)
  user: User;

  @Column({ name: 'market_symbol' })
  marketSymbol: string;

  @Column({ type: 'varchar' })
  direction: 'BUY' | 'SELL' | 'HOLD';

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2 })
  confidenceScore: number;

  @Column({ name: 'entry_zone', type: 'jsonb', nullable: true })
  entryZone: {
    low: number;
    high: number;
  };

  @Column({ name: 'stop_loss', type: 'decimal', precision: 20, scale: 8, nullable: true })
  stopLoss: number;

  @Column({ name: 'take_profit', type: 'decimal', precision: 20, scale: 8, nullable: true })
  takeProfit: number;

  @Column({ name: 'risk_reward_ratio', type: 'decimal', precision: 5, scale: 2, nullable: true })
  riskRewardRatio: number;

  @Column({ name: 'pattern_detected', type: 'jsonb', nullable: true })
  patternDetected: {
    type: string;
    confidence: number;
    target: number;
    invalidation: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
