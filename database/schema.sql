-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{
        "autoTradingEnabled": false,
        "confidenceThreshold": 70,
        "defaultStake": 10,
        "maxRiskPercent": 2,
        "dailyLossLimit": 100,
        "maxDrawdown": 20,
        "maxOpenPositions": 5,
        "notificationPreferences": {
            "email": true,
            "browser": true
        }
    }',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Deriv accounts table
CREATE TABLE IF NOT EXISTS deriv_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_id VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) CHECK (account_type IN ('demo', 'real')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expiry TIMESTAMP NOT NULL,
    account_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES deriv_accounts(id),
    market_symbol VARCHAR(100) NOT NULL,
    direction VARCHAR(4) CHECK (direction IN ('BUY', 'SELL')),
    entry_price DECIMAL(20, 8) NOT NULL,
    exit_price DECIMAL(20, 8),
    stop_loss DECIMAL(20, 8),
    take_profit DECIMAL(20, 8),
    stake DECIMAL(20, 8) NOT NULL,
    profit_loss DECIMAL(20, 8),
    confidence_score DECIMAL(5, 2),
    pattern_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Signals table
CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    market_symbol VARCHAR(100) NOT NULL,
    direction VARCHAR(4) CHECK (direction IN ('BUY', 'SELL', 'HOLD')),
    confidence_score DECIMAL(5, 2),
    entry_zone JSONB,
    stop_loss DECIMAL(20, 8),
    take_profit DECIMAL(20, 8),
    risk_reward_ratio DECIMAL(5, 2),
    pattern_detected JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market data cache
CREATE TABLE IF NOT EXISTS market_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(100) NOT NULL,
    open DECIMAL(20, 8),
    high DECIMAL(20, 8),
    low DECIMAL(20, 8),
    close DECIMAL(20, 8),
    volume DECIMAL(20, 8),
    timestamp TIMESTAMP NOT NULL,
    UNIQUE(symbol, timestamp)
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    win_rate DECIMAL(5, 2),
    total_profit_loss DECIMAL(20, 8),
    average_profit DECIMAL(20, 8),
    average_loss DECIMAL(20, 8),
    profit_factor DECIMAL(10, 2),
    max_drawdown DECIMAL(5, 2),
    UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_opened_at ON trades(opened_at);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON signals(created_at);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol_timestamp ON market_data(symbol, timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id_date ON performance_metrics(user_id, date);
