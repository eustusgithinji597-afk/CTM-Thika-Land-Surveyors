# Quick Start: Setting Up Supabase Backend

Complete these steps in order to get your CTM Thika application running with Supabase.

## 1. Create Supabase Account (2 minutes)

1. Visit https://supabase.com and click "Sign Up"
2. Use email or GitHub to create account
3. Click "New Project"
4. Fill in:
   - Project name: `ctm-thika-surveyors`
   - Password: Create a strong password
   - Region: Europe (Ireland) or Asia-Pacific (Singapore)
5. Wait for project initialization

## 2. Get Your Credentials (1 minute)

In Supabase Dashboard:
1. Go to **Settings → Database** and copy the "Connection String"
2. Go to **Settings → API** and copy:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

## 3. Update Environment Variables (1 minute)

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
```

## 4. Apply Database Schema (2 minutes)

### Option A: Supabase Dashboard (Easiest)
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `/supabase/migrations/001_init_schema.sql` in your editor
4. Copy entire contents
5. Paste into Supabase SQL editor
6. Click **Run**
7. Wait for success message

### Option B: CLI (Advanced)
```bash
# Install CLI (if not already installed)
npm install -g supabase

# Link your project
supabase link --project-ref [YOUR_PROJECT_ID]

# Apply migrations
supabase db push
```

## 5. Create Storage Bucket (2 minutes)

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Name: `property-images`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

## 6. Test the Setup (5 minutes)

```bash
# Start development server
npm run dev
```

1. Visit http://localhost:3000/admin/login
2. Create a test property:
   - Click "Add Property"
   - Fill in details
   - Upload test images
   - Click Save
3. Visit http://localhost:3000
4. Scroll to "Available Properties"
5. Your test property appears instantly ✓

## Troubleshooting

### "Connection refused" error
- ❌ DATABASE_URL is incorrect
- ✓ Copy exactly from Supabase Dashboard
- ✓ Check special characters in password

### Images not uploading
- ✓ Verify storage bucket is public
- ✓ Check file size < 50MB
- ✓ Ensure bucket named `property-images`

### Properties not showing
- ✓ Check properties table has data: `SELECT COUNT(*) FROM properties`
- ✓ Verify GET `/api/properties` returns data
- ✓ Check browser console for fetch errors

### Real-time updates not working
- ✓ Verify Realtime is enabled in Supabase
- ✓ Check browser WebSocket connection
- ✓ Look for errors in browser DevTools

## Next: Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See `SUPABASE_SETUP.md` for detailed information.
