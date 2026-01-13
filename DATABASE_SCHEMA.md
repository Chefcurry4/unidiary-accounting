# Supabase Database Schema

This document contains the SQL schema for setting up the Supabase database for UniDiary Accounting.

## Setup Options

Choose one of the following schema options based on your deployment needs:

### Option 1: Single User (Simplified)

If the application is for a single user or organization, use this simplified schema:

## Tables

### 1. Expenses Table

Stores all expense records including one-time and recurring expenses.

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  isRecurring BOOLEAN NOT NULL DEFAULT false,
  recurrenceInterval TEXT,
  nextDueDate TEXT,
  isPaid BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_isPaid ON expenses(isPaid);
```

### 2. Budgets Table

Stores budget configurations for different categories and time periods.

```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  period TEXT NOT NULL,
  startDate TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(period);
```

### 3. Profiles Table

Stores user profile information.

```sql
CREATE TABLE profiles (
  userId TEXT PRIMARY KEY,
  bio TEXT,
  location TEXT,
  company TEXT,
  phone TEXT
);
```

### Option 2: Multi-User Support

If you need multi-user support with data isolation, add a `userId` column to expenses and budgets tables:

```sql
-- Add userId column to expenses
ALTER TABLE expenses ADD COLUMN userId TEXT NOT NULL DEFAULT 'default-user';
CREATE INDEX idx_expenses_userId ON expenses(userId);

-- Add userId column to budgets
ALTER TABLE budgets ADD COLUMN userId TEXT NOT NULL DEFAULT 'default-user';
CREATE INDEX idx_budgets_userId ON budgets(userId);
```

## Row Level Security (RLS) - Optional

For production deployment with multi-user support, enable Row Level Security to ensure data privacy:

```sql
-- Enable RLS on all tables
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Example policies for multi-user setup
-- These examples assume you're using Supabase Auth

-- Expenses policies
CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid()::text = userId);

-- Budgets policies
CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid()::text = userId);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = userId);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = userId);
```

**Note for single-user deployments:** You can skip RLS setup if the application is for internal use only.

## Notes

1. **UUID Generation**: Make sure the `uuid-ossp` extension is enabled in your Supabase project:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. **User Authentication**: The current implementation uses `window.spark.user()` for authentication. You may need to adapt the authentication mechanism when deploying to production with Supabase Auth.

3. **Data Migration**: If you have existing data in the Spark KV Store, you'll need to migrate it to Supabase manually or create a migration script.

4. **Environment Variables**: Don't forget to set up your `.env` file with the Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Real-time Subscriptions** (Optional): If you want real-time updates, you can set up Supabase real-time subscriptions in your hooks:
   ```typescript
   supabase
     .channel('expenses')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, 
       payload => {
         console.log('Change received!', payload)
         // Refetch or update state
       }
     )
     .subscribe()
   ```
