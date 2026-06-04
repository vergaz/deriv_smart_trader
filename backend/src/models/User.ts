import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DerivAccount } from './DerivAccount';
import { Trade } from './Trade';
import { Signal } from './Signal';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @OneToMany(() => DerivAccount, account => account.user)
  derivAccounts: DerivAccount[];

  @OneToMany(() => Trade, trade => trade.user)
  trades: Trade[];

  @OneToMany(() => Signal, signal => signal.user)
  signals: Signal[];

  @Column({ type: 'jsonb', default: {} })
  settings: {
    autoTradingEnabled?: boolean;
    confidenceThreshold?: number;
    defaultStake?: number;
    maxRiskPercent?: number;
    dailyLossLimit?: number;
    maxDrawdown?: number;
    maxOpenPositions?: number;
    notificationPreferences?: {
      email: boolean;
      browser: boolean;
    };
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;
}
