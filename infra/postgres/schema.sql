-- Use UUIDs for 100k+ scale to prevent ID guessing and allow easy sharding
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);