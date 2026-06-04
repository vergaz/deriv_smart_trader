import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('deriv_accounts')
export class DerivAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.derivAccounts)
  user: User;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'account_type', type: 'varchar' })
  accountType: 'demo' | 'real';

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string;

  @Column({ name: 'token_expiry', type: 'timestamp' })
  tokenExpiry: Date;

  @Column({ name: 'account_info', type: 'jsonb', default: {} })
  accountInfo: {
    balance: number;
    equity: number;
    currency: string;
    landingCompany: string;
  };

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'connected_at' })
  connectedAt: Date;

  @Column({ name: 'last_synced_at', type: 'timestamp', nullable: true })
  lastSyncedAt: Date;
}
