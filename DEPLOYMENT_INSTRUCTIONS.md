# Deployment Instructions for UniDiary Accounting

This guide covers how to deploy UniDiary Accounting with Supabase backend to GitHub Pages.

## Prerequisites

- A GitHub account
- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js 18+ installed locally (for testing)

## Step 1: Set Up Supabase Project

### 1.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "unidiary-accounting")
5. Set a secure database password (save this!)
6. Select your preferred region
7. Click "Create new project"

### 1.2 Get Your API Credentials

1. Once your project is ready, go to **Settings → API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xyzproject.supabase.co`)
   - **anon public** key (under "Project API keys")

### 1.3 Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql` from this repository
4. Click "Run" to execute the SQL

This will create the following tables with Row Level Security:
- `expenses` - For tracking expenses
- `budgets` - For budget management
- `profiles` - For user profile data

## Step 2: Configure GitHub Repository Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |

## Step 3: Enable GitHub Pages

1. Go to your repository's **Settings → Pages**
2. Under "Build and deployment", select:
   - **Source**: GitHub Actions
3. The workflow will automatically deploy when you push to the `main` branch

## Step 4: Deploy

### Automatic Deployment
Simply push your changes to the `main` branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Install dependencies
2. Build the project with your Supabase credentials
3. Deploy to GitHub Pages

### Manual Deployment
You can also trigger a deployment manually:
1. Go to **Actions** tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Step 5: Access Your Site

After deployment, your site will be available at:
```
https://<your-username>.github.io/unidiary-accounting/
```

For example, if your GitHub username is `johndoe`, your site will be at:
```
https://johndoe.github.io/unidiary-accounting/
```

## Step 6: Verify Deployment

1. Wait for the GitHub Actions workflow to complete (usually 2-5 minutes)
2. Check the **Actions** tab to monitor deployment progress
3. Once complete, visit your site URL
4. Test the following:
   - Sign up with a new account
   - Log in
   - Add an expense
   - Create a budget
   - Verify data persists after refresh

## Troubleshooting

### Build Fails

**Issue**: The build step fails in GitHub Actions

**Solutions**:
- Verify that both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secrets are set correctly
- Check the Actions logs for specific error messages
- Ensure your `package.json` dependencies are up to date

### 404 Errors on Page Refresh

**Issue**: Refreshing the page on a route other than home returns a 404

**Solutions**:
- Ensure `public/404.html` exists in your repository
- Verify the redirect script is present in `index.html`
- The SPA routing fix should handle this automatically

### Authentication Not Working

**Issue**: Cannot sign up or log in

**Solutions**:
- Verify Supabase credentials in GitHub Secrets are correct
- Check that the database schema has been executed in Supabase
- Ensure Row Level Security (RLS) policies are enabled on tables
- Check browser console for specific error messages

### Data Not Persisting

**Issue**: Data doesn't save or disappears after refresh

**Solutions**:
- Verify database tables were created correctly in Supabase
- Check RLS policies allow authenticated users to read/write
- Review the Supabase dashboard logs for errors
- Ensure you're logged in before adding data

### Blank Page After Deployment

**Issue**: Site loads but shows a blank page

**Solutions**:
- Check browser console for JavaScript errors
- Verify the `base` path in `vite.config.ts` matches your repo name
- Clear browser cache and hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check that all environment variables are set in build

## Local Development

To run the project locally with your Supabase backend:

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/unidiary-accounting.git
cd unidiary-accounting
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Updating the Deployment

To update your deployed site:

1. Make your changes locally
2. Test them with `npm run dev`
3. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```
4. Push to main:
```bash
git push origin main
```

The GitHub Actions workflow will automatically rebuild and redeploy your site.

## Security Considerations

- **Never commit** your `.env.local` file or expose your Supabase credentials
- The `anon` key is safe to use in the browser (it's public)
- Row Level Security (RLS) in Supabase ensures users can only access their own data
- Always use HTTPS (GitHub Pages provides this by default)

## Support

For issues specific to:
- **UniDiary Accounting**: Open an issue on the GitHub repository
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs) or [Discord](https://discord.supabase.com/)
- **GitHub Pages**: See [GitHub Pages documentation](https://docs.github.com/en/pages)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
