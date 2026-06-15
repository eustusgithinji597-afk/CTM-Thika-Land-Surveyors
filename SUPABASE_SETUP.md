# Supabase Setup Guide for CTM Thika Land Surveyors

This guide will help you set up the Supabase backend for the CTM Thika Land Surveyors platform with real-time data synchronization between the Admin Dashboard and public User Page.

## Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Node.js 16+ installed
- Git and command line familiarity

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up or log in
2. Click "New Project"
3. Enter project details:
   - **Project Name**: `ctm-thika-surveyors`
   - **Database Password**: Create a strong password
   - **Region**: Select the region closest to Kenya (Europe or Asia-Pacific recommended)
4. Wait for the project to initialize (5-10 minutes)

## Step 2: Get Your Connection Credentials

1. In Supabase dashboard, go to **Settings** → **Database**
2. Copy the following connection strings:
   - **Connection String** (for PostgreSQL clients)
   - **Project URL** (API endpoint)
   - **Anon Key** (Public API key)
   - **Service Role Key** (Admin key - keep this SECRET)

## Step 3: Update Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Database connection
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres

# Supabase API
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Phone number for WhatsApp integration
NEXT_PUBLIC_WHATSAPP_NUMBER=254769311896
```

## Step 4: Apply Database Schema

### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `/supabase/migrations/001_init_schema.sql`
4. Paste it into the SQL editor
5. Click **Run**
6. The tables, enums, and indexes will be created

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref [YOUR_PROJECT_ID]

# Apply migrations
supabase db push

# Verify schema
supabase db list
```

## Step 5: Configure Storage Buckets (for images)

1. In Supabase dashboard, go to **Storage**
2. Click **Create new bucket**
3. Create a bucket named `property-images` with these settings:
   - **Public bucket**: Toggle ON (for public image access)
   - **File size limit**: 50 MB

4. Click on the bucket and go to **Policies**
5. Add a policy to allow public read access:
   - **Policy**: Allow public read access
   - **Operation**: SELECT
   - **Target roles**: Public (authenticated and anonymous)

## Step 6: Set Up Real-time Subscriptions

Real-time updates are automatically enabled. The application will:
- Listen for property changes and update the public grid instantly
- Listen for lead submissions and update the admin dashboard
- Automatically sync status changes between admin and public views

## Step 7: Test the Setup

1. In your terminal, run:
```bash
npm run dev
```

2. Visit http://localhost:3000/admin/login

3. Create a test property:
   - Click "Add Property"
   - Fill in the form with sample data
   - Upload images
   - Click Save

4. Visit http://localhost:3000 and scroll to "Available Properties"
   - Your test property should appear immediately
   - Click the card to view the detail modal with carousel

5. Submit the contact form:
   - Fill in the form
   - Click "Get in Touch"
   - Visit http://localhost:3000/admin/leads to see the submission

## Database Schema Overview

### Properties Table
Stores real estate listings synchronized to the public view.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique property identifier |
| title | TEXT | Property title (e.g., "Prime 1/8 Acre Plots") |
| location | TEXT | Location (e.g., "Gatanga Road, Thika") |
| price | NUMERIC | Property price in KES |
| image_url | TEXT | Primary image URL |
| image_urls | TEXT[] | Array of all image URLs (carousel) |
| description | TEXT | Detailed property description |
| status | ENUM | 'available' or 'sold' |
| amenities | TEXT[] | Array of amenities (e.g., ['Ready Title', 'Water', 'Fenced']) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Leads Table
Stores all contact form submissions from the public page.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique lead identifier |
| name | TEXT | Client name |
| phone | TEXT | Contact phone number |
| service_type | ENUM | Service requested: 'survey', 'plot_booking', 'mutation_forms' |
| status | ENUM | 'new' or 'contacted' |
| created_at | TIMESTAMP | Submission timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## API Endpoints

### Properties
- **GET** `/api/properties` - Fetch all properties
- **POST** `/api/properties` - Create new property (admin)
- **PUT** `/api/properties` - Update property (admin)
- **DELETE** `/api/properties?id=UUID` - Delete property (admin)

### Leads
- **GET** `/api/leads` - Fetch all leads (admin)
- **POST** `/api/leads` - Submit contact form (public)
- **PATCH** `/api/leads` - Update lead status (admin)

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct
- Check that Supabase project is running
- Ensure firewall allows PostgreSQL connections
- Check connection string format: `postgresql://user:password@host:port/database`

### Image Upload Issues
- Verify storage bucket is public
- Check file size limits
- Ensure MIME types are allowed (image/jpeg, image/png, etc.)

### Real-time Updates Not Working
- Verify Realtime is enabled in Supabase settings
- Check browser console for WebSocket errors
- Ensure you're authenticated for admin operations

## Security Considerations

1. **Never commit secrets** - Keep `.env.local` in `.gitignore`
2. **Service Role Key** - Only use server-side, never expose to client
3. **RLS Policies** - Already configured, but customize as needed
4. **Rate Limiting** - Implement in production for API endpoints
5. **Image Storage** - Consider implementing virus scanning for uploads

## Next Steps

1. Deploy to Vercel: https://vercel.com/docs/deployments/git
2. Set environment variables in Vercel dashboard
3. Enable GitHub Actions for automatic deployments
4. Monitor Supabase analytics and logs
5. Set up email notifications for new leads

## Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Project Repository: https://github.com/eustusgithinji597-afk/mines.git
