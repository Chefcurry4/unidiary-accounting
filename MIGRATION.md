# Migration Guide: Spark KV Store to Supabase

This guide helps you migrate existing data from the Spark KV Store to Supabase.

## Prerequisites

1. A Supabase project with the database schema set up (see `DATABASE_SCHEMA.md`)
2. Access to your Spark application with existing data
3. Supabase environment variables configured in `.env`

## Migration Steps

### Step 1: Export Data from Spark KV Store

If you have existing data in the Spark KV Store, you'll need to export it first. You can do this by running the following in your browser's console while the old version of the app is running:

```javascript
// Export expenses
const expenses = await window.spark.kv.get('expenses');
console.log('Expenses:', JSON.stringify(expenses, null, 2));
// Copy the output and save to expenses.json

// Export budgets
const budgets = await window.spark.kv.get('budgets');
console.log('Budgets:', JSON.stringify(budgets, null, 2));
// Copy the output and save to budgets.json

// Export profile
const profile = await window.spark.kv.get('user-profile');
console.log('Profile:', JSON.stringify(profile, null, 2));
// Copy the output and save to profile.json
```

### Step 2: Prepare Migration Script

Create a file called `migrate.js` in your project root:

```javascript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateExpenses() {
  const expenses = JSON.parse(fs.readFileSync('./expenses.json', 'utf8'))
  
  if (!expenses || expenses.length === 0) {
    console.log('No expenses to migrate')
    return
  }

  // Remove id and let Supabase generate new UUIDs
  const expensesData = expenses.map(({ id, ...rest }) => rest)
  
  const { data, error } = await supabase
    .from('expenses')
    .insert(expensesData)
  
  if (error) {
    console.error('Error migrating expenses:', error)
  } else {
    console.log(`Successfully migrated ${expensesData.length} expenses`)
  }
}

async function migrateBudgets() {
  const budgets = JSON.parse(fs.readFileSync('./budgets.json', 'utf8'))
  
  if (!budgets || budgets.length === 0) {
    console.log('No budgets to migrate')
    return
  }

  // Remove id and let Supabase generate new UUIDs
  const budgetsData = budgets.map(({ id, ...rest }) => rest)
  
  const { data, error } = await supabase
    .from('budgets')
    .insert(budgetsData)
  
  if (error) {
    console.error('Error migrating budgets:', error)
  } else {
    console.log(`Successfully migrated ${budgetsData.length} budgets`)
  }
}

async function migrateProfile() {
  const profile = JSON.parse(fs.readFileSync('./profile.json', 'utf8'))
  
  if (!profile) {
    console.log('No profile to migrate')
    return
  }

  // You'll need to get the actual user ID
  const userId = 'your-user-id' // Replace with actual user ID
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ userId, ...profile })
  
  if (error) {
    console.error('Error migrating profile:', error)
  } else {
    console.log('Successfully migrated profile')
  }
}

async function migrate() {
  console.log('Starting migration...')
  await migrateExpenses()
  await migrateBudgets()
  await migrateProfile()
  console.log('Migration complete!')
}

migrate()
```

### Step 3: Run the Migration

```bash
# Make sure you have the exported JSON files
# and your .env file with Supabase credentials

node migrate.js
```

### Step 4: Verify Migration

After running the migration script:

1. Check your Supabase dashboard to verify the data was imported
2. Start the updated application
3. Verify that all data appears correctly

## Manual Migration (Alternative)

If you prefer to migrate data manually:

1. Open your Supabase project dashboard
2. Go to the Table Editor
3. Select each table (expenses, budgets, profiles)
4. Use the "Insert row" feature to manually add your data

## Rollback

If you need to rollback:

1. Keep the old version of the application in a separate branch
2. The old Spark KV Store data remains intact and separate from Supabase
3. You can switch back to the old branch if needed

## Notes

- **IDs**: The Spark KV Store used string IDs like `exp-${Date.now()}`. Supabase uses UUIDs. The migration script handles this by letting Supabase generate new UUIDs.
- **Timestamps**: Make sure the `createdAt` timestamps are preserved during migration.
- **Testing**: Always test the migration on a development Supabase project first before migrating production data.

## Troubleshooting

### Error: "duplicate key value violates unique constraint"

This means some data already exists. You can either:
- Clear the existing data in Supabase
- Use `.upsert()` instead of `.insert()` in the migration script

### Error: "relation does not exist"

This means the tables haven't been created yet. Run the SQL schema from `DATABASE_SCHEMA.md` first.

### Data types don't match

Ensure your exported data matches the schema types:
- `amount` should be a number
- `isRecurring` and `isPaid` should be boolean
- Dates should be in ISO string format

## Support

If you encounter issues during migration, please open an issue in the repository with:
- Error messages
- Sample data structure (with sensitive info removed)
- Steps you've already tried
