# Complete Setup Guide

Follow these steps to deploy the Editor Monitor System.

---

## Overview

| Step | Time | What You'll Do |
|------|------|----------------|
| 1 | 3 min | Create Supabase database |
| 2 | 3 min | Get Groq API key |
| 3 | 3 min | Get Resend API key |
| 4 | 5 min | Deploy to Vercel |
| 5 | 5 min | Test the system |
| **Total** | **~20 min** | |

---

## Step 1: Set Up Supabase Database (Free)

1. Go to **https://supabase.com**
2. Click **Start your project** → Sign up with GitHub
3. Click **New Project**
   - Name: `editor-monitor`
   - Database password: Choose a strong password (save it)
   - Region: Choose closest to you
4. Wait 2 minutes for project to be ready
5. Click **SQL Editor** in the left sidebar
6. Click **New Query**
7. Open the file `config/schema.sql` from your project folder
8. Copy ALL the contents
9. Paste into the SQL Editor
10. Click **Run** (or press Ctrl+Enter)
11. You should see "Success. No rows returned" - this is correct!

**Get your keys:**
1. Click **Settings** (gear icon) in the left sidebar
2. Click **API**
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

---

## Step 2: Get Groq API Key (Free)

1. Go to **https://console.groq.com**
2. Sign up with Google or GitHub
3. Click **API Keys** in the left menu
4. Click **Create API Key**
5. Name it: `editor-monitor`
6. Copy the key (starts with `gsk_...`)

---

## Step 3: Get Resend API Key (Free)

1. Go to **https://resend.com**
2. Sign up with email
3. Click **API Keys** in the sidebar
4. Click **Create API Key**
5. Name it: `editor-monitor`
6. Copy the key (starts with `re_...`)

---

## Step 4: Deploy to Vercel (Free)

### 4a. Push to GitHub

1. Create a new GitHub repository
2. Upload all files from the `editor-monitor` folder
3. Or use Git:
   ```bash
   cd editor-monitor
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/editor-monitor.git
   git push -u origin main
   ```

### 4b. Deploy on Vercel

1. Go to **https://vercel.com**
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Select your `editor-monitor` repository
5. **IMPORTANT:** Before clicking Deploy, add Environment Variables:

   Click **Environment Variables** and add each of these:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | Your Supabase Project URL |
   | `SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `GROQ_API_KEY` | Your Groq API key |
   | `RESEND_API_KEY` | Your Resend API key |
   | `ADMIN_EMAIL` | `narjes@w16media.co` |
   | `ADMIN_PASSWORD` | Choose a secure password |
   | `ELEVENLABS_API_KEY` | `sk_87527e1c37f2f1d5c2035a2f0766ca571a3c23afddf67c3a` |

6. Click **Deploy**
7. Wait 1-2 minutes
8. Copy your deployment URL (like `https://editor-monitor-xxx.vercel.app`)

---

## Step 5: Test the System

See **TESTING_GUIDE.md** for detailed testing steps.

Quick test:
1. Go to your deployment URL
2. Enter your test key: `narjes_aurapets_k8m3n7p2q9w4x1y6z0`
3. Select **Veo 3**
4. Paste a dog eye health script
5. Click **Submit for Approval**
6. Should show ✅ "Script Approved"

Test flagging:
1. Use the same key
2. Submit a weight loss script
3. Should show 🚨 "Script Flagged"
4. Check your email for the alert

---

## Step 6: Roll Out to Editors

1. Share the portal URL with editors
2. Give each editor ONLY their unique API key (see `EDITOR_API_KEYS.md`)
3. Share the `EDITOR_INSTRUCTIONS.md` guide with them
4. Monitor the admin dashboard for flagged content

---

## Your URLs

After deployment, bookmark these:

| URL | Purpose |
|-----|---------|
| `https://YOUR-APP.vercel.app` | Editor Portal |
| `https://YOUR-APP.vercel.app/admin.html` | Admin Dashboard |

---

## Troubleshooting

### "Invalid API key" error
- Double-check the SUPABASE keys in Vercel environment variables
- Make sure you ran the SQL schema in Supabase

### Not receiving emails
- Check RESEND_API_KEY is correct
- Check spam folder
- Resend free tier: 3000 emails/month

### Classification not working
- Check GROQ_API_KEY is correct
- Very short prompts may not classify accurately

### Deployment failed
- Check Vercel build logs for errors
- Ensure all environment variables are set

---

## Need Help?

Check the `docs/` folder for:
- `TESTING_GUIDE.md` - Detailed testing steps
- `EDITOR_INSTRUCTIONS.md` - Guide for editors
- `EDITOR_API_KEYS.md` - All API keys
