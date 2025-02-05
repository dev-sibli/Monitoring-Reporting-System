-- Create Regions table
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Users table (for Collection Officers and Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
    region_id INTEGER REFERENCES regions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Merchants table
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Banks table
CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create Clearing Branches table
CREATE TABLE clearing_branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create Commission Entries table
CREATE TABLE commission_entries (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER REFERENCES merchants(id),
    invoice_number VARCHAR(50) NOT NULL,
    collection_date DATE NOT NULL,
    collected_amount DECIMAL(12, 2) NOT NULL,
    bank_id INTEGER REFERENCES banks(id),
    check_number VARCHAR(50),
    clearing_branch_id INTEGER REFERENCES clearing_branches(id),
    check_submission_date DATE,
    collection_officer_id INTEGER REFERENCES users(id),
    region_id INTEGER REFERENCES regions(id),
    memo TEXT,
    file_attachment VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Year Month table (for multiple year/month entries per commission entry)
CREATE TABLE year_month_entries (
    id SERIAL PRIMARY KEY,
    commission_entry_id INTEGER REFERENCES commission_entries(id),
    year INTEGER NOT NULL,
    month VARCHAR(20) NOT NULL,
    bill_amount DECIMAL(12, 2) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_commission_entries_merchant_id ON commission_entries(merchant_id);
CREATE INDEX idx_commission_entries_collection_officer_id ON commission_entries(collection_officer_id);
CREATE INDEX idx_commission_entries_region_id ON commission_entries(region_id);
CREATE INDEX idx_year_month_entries_commission_entry_id ON year_month_entries(commission_entry_id);

