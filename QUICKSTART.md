# Quick Start Guide

This guide will help you get UniDiary Accounting up and running with Supabase.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Chefcurry4/unidiary-accounting.git
cd unidiary-accounting
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `unidiary-accounting`
   - Database Password: (choose a strong password)
   - Region: (select closest to you)
4. Click "Create new project" and wait for it to initialize

#### Create Database Tables

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the SQL from `DATABASE_SCHEMA.md` (Option 1: Single User schema)
3. Paste and run the SQL to create the tables

#### Get Your Credentials

1. In your Supabase project, go to Settings > API
2. Copy the following:
   - Project URL
   - Project API keys > `anon` `public`

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Testing Your Setup

1. **Add an Expense**: Click "Add Expense" button and create a test expense
2. **Check Supabase**: Go to your Supabase dashboard > Table Editor > expenses table
3. **Verify**: You should see your test expense in the table

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Common Issues

### "Missing Supabase environment variables" Error

**Solution**: Make sure your `.env` file exists and has the correct variable names:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Restart the dev server after creating/updating the `.env` file.

### Tables Not Found Error

**Solution**: Run the SQL schema from `DATABASE_SCHEMA.md` in your Supabase SQL Editor.

### Data Not Persisting

**Solution**: 
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Check Supabase dashboard > Logs for any errors

## Next Steps

- **Enable RLS**: For production, set up Row Level Security (see `DATABASE_SCHEMA.md`)
- **Add Authentication**: Integrate Supabase Auth for multi-user support
- **Customize**: Modify the theme in `src/index.css`
- **Deploy**: Deploy to Vercel, Netlify, or your preferred hosting platform

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run linter (requires ESLint config)

## Need Help?

- Check `DATABASE_SCHEMA.md` for database setup details
- See `MIGRATION.md` if migrating from Spark KV Store
- Check `README.md` for feature documentation
- Open an issue on GitHub

---

Happy expense tracking! 💰
