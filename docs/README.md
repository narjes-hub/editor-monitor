# Editor Monitor System

A system to track and monitor AI tool usage by editors, automatically detecting off-brand content and alerting administrators.

## Features

- **Editor Portal**: Clean interface for editors to submit AI generation requests
- **API Key Authentication**: Each editor has a unique API key tied to their brand
- **AI Content Classification**: Automatically detects if content matches the editor's assigned brand
- **Instant Email Alerts**: Get notified immediately when off-brand content is detected
- **Admin Dashboard**: View all activity, flagged requests, and manage editors
- **Full Audit Trail**: Every request is logged with timestamp, editor, and content

## Tech Stack (100% Free)

- **Hosting**: Vercel (free tier)
- **Database**: Supabase (free tier - 500MB)
- **AI Classification**: Groq (free tier - Llama 3.1 70B)
- **Email**: Resend (free tier - 3,000 emails/month)

## Quick Setup (15 minutes)

### Step 1: Create Free Accounts

1. **Supabase** (Database): https://supabase.com
   - Create a new project
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

2. **Groq** (AI): https://console.groq.com
   - Sign up and get your API key

3. **Resend** (Email): https://resend.com
   - Sign up and get your API key
   - Verify your domain or use their test domain

4. **Vercel** (Hosting): https://vercel.com
   - Sign up with GitHub

### Step 2: Set Up Database

1. Go to your Supabase project
2. Click "SQL Editor" in the sidebar
3. Copy the contents of `lib/schema.sql`
4. Paste and click "Run"

This creates all tables and inserts your editors with API keys.

### Step 3: Get Editor API Keys

After running the SQL, get the API keys:

```sql
SELECT name, api_key, brand_id FROM editors ORDER BY brand_id, name;
```

You'll see something like:
```
| name     | api_key                           | brand_id  |
|----------|-----------------------------------|-----------|
| James    | ap_james_a1b2c3d4e5f6...          | aurapets  |
| John     | ap_john_x7y8z9w0v1u2...           | aurapets  |
| Santanu  | le_santanu_m3n4o5p6q7...          | lumineye  |
```

**Distribute these keys to each editor.**

### Step 4: Deploy to Vercel

1. Push this project to GitHub

2. Go to Vercel and import the repository

3. Add Environment Variables in Vercel:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=narjes@w16media.co
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. Click Deploy

5. Your system is live at: `https://your-project.vercel.app`

## Usage

### For Editors

1. Go to the portal: `https://your-project.vercel.app`
2. Enter your API key
3. Select a tool (Veo 3, MakeUGC, ElevenLabs, Higgsfield)
4. Enter your script/prompt
5. Submit

### For Admins

1. Go to: `https://your-project.vercel.app/admin.html`
2. Enter your admin password
3. View all activity, flagged requests, and editor stats
4. Click "View API Keys" to see all editor keys

## How Detection Works

The system uses Groq's Llama 3.1 70B model to analyze each prompt:

1. Editor submits a request
2. AI analyzes if the content matches the editor's assigned brand
3. If **on-brand**: Request is logged as clean
4. If **off-brand**:
   - Request is flagged
   - Email is sent immediately to admin
   - Email includes the full script they tried to generate

### Example Flags

| Editor | Brand | Submits | Result |
|--------|-------|---------|--------|
| John | Aurapets | Dog eye health script | ✅ Clean |
| John | Aurapets | Weight loss product ad | 🚨 Flagged |
| Santanu | LuminEye | Human vision testimonial | ✅ Clean |
| Santanu | LuminEye | Crypto trading video | 🚨 Flagged |

## Email Alert Format

When off-brand content is detected, you receive:

```
🚨 OFF-BRAND CONTENT DETECTED

Editor: John
Assigned Brand: Aurapets (shopaurapets.com)
Tool: ElevenLabs
Time: 2024-01-15 14:32:05

⚠️ Content Analysis:
Detected Topic: Weight loss supplements for humans
Expected: Dog eye health nano drops
Reason: Content is about human weight loss, not dog eye health

SCRIPT THEY TRIED TO GENERATE:
────────────────────────────────
[Full script content here]
────────────────────────────────
```

## Brands Configuration

Edit `lib/brands.js` to:
- Add new brands
- Modify valid topics
- Assign editors to different brands

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Submit generation request |
| `/api/dashboard` | GET | Get activity data (admin) |
| `/api/editors` | GET | Get all editor keys (admin) |

## Security Notes

- API keys should be kept private by each editor
- Admin password protects the dashboard
- All requests are logged regardless of flag status
- Email alerts contain full prompt content

## Cost

**$0/month** for typical usage:
- Vercel: Free for serverless functions
- Supabase: Free up to 500MB database
- Groq: Free tier handles thousands of classifications
- Resend: 3,000 free emails/month

## Support

For issues or questions, contact the development team.

---

Built for W16 Media
