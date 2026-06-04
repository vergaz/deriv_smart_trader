import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { DerivAccount } from './DerivAccount';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.trades)
  user: User;

  @ManyToOne(() => DerivAccount, { nullable: true })
  account: DerivAccount;

  @Column({ name: 'market_symbol' })
  marketSymbol: string;

  @Column({ type: 'varchar' })
  direction: 'BUY' | 'SELL';

  @Column({ name: 'entry_price', type: 'decimal', precision: 20, scale: 8 })
  entryPrice: number;

  @Column({ name: 'exit_price', type: 'decimal', precision: 20, scale: 8, nullable: true })
  exitPrice: number;

  @Column({ name: 'stop_loss', type: 'decimal', precision: 20, scale: 8, nullable: true })
  stopLoss: number;

  @Column({ name: 'take_profit', type: 'decimal', precision: 20, scale: 8, nullable: true })
  takeProfit: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  stake: number;

  @Column({ name: 'profit_loss', type: 'decimal', precision: 20, scale: 8, nullable: true })
  profitLoss: number;

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidenceScore: number;

  @Column({ name: 'pattern_type', nullable: true })
  patternType: string;

  @Column({ type: 'varchar', default: 'OPEN' })
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';

  @CreateDateColumn({ name: 'opened_at' })
  openedAt: Date;

  @UpdateDateColumn({ name: 'closed_at', nullable: true })
  closedAt: Date;
}
