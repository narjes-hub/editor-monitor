# Testing Guide for Narjes

This guide walks you through testing the Editor Monitor system before rolling it out to editors.

---

## Your Test API Keys

| Key | Brand | Use For |
|-----|-------|---------|
| `narjes_aurapets_k8m3n7p2q9w4x1y6z0` | Aurapets | Test dog-related content detection |
| `narjes_lumineye_j5h9l2o6r3t8v1a4b7` | LuminEye | Test human eye health content detection |

---

## Step-by-Step Testing

### Test 1: On-Brand Content (Should PASS)

1. Go to your portal: `https://your-app.vercel.app`
2. Enter your Aurapets test key: `narjes_aurapets_k8m3n7p2q9w4x1y6z0`
3. Select tool: **Veo 3**
4. Paste this script:

```
My dog had cloudy eyes for 2 years. The vet said it was just aging.
Then I found AuraPets Nano Drops. Within weeks, the cloudiness started clearing.
Now my dog can see clearly again and catches treats mid-air!
AuraPets helped over 100,000 dogs. Try it risk-free with our 90-day guarantee.
```

5. Click **Submit for Approval**
6. **Expected result:** ✅ "Script Approved" screen

---

### Test 2: Off-Brand Content (Should FLAG)

1. Stay on the portal
2. Click "Submit Another Script"
3. Keep the same Aurapets key
4. Select tool: **ElevenLabs**
5. Paste this script:

```
Lose 30 pounds in 30 days with our revolutionary keto diet pills!
Clinical trials show 95% of users lost significant weight.
Order now and get free shipping. Limited time offer!
```

6. Click **Submit for Approval**
7. **Expected result:** 🚨 "Script Flagged" screen
8. **Check your email:** You should receive an alert at narjes@w16media.co

---

### Test 3: Cross-Brand Content (Should FLAG)

1. Use your Aurapets key: `narjes_aurapets_k8m3n7p2q9w4x1y6z0`
2. Select tool: **MakeUGC**
3. Paste LuminEye content (wrong brand for this key):

```
I'm 64 years old and my vision was getting worse every year.
Floaters, blurry vision, dry eyes. My doctor said it's just aging.
Then I found LuminEye drops. The stem cell formula goes under your tongue.
Within months, my vision improved dramatically. I can read again without glasses!
```

4. Click **Submit for Approval**
5. **Expected result:** 🚨 "Script Flagged" - because Aurapets editors shouldn't create LuminEye content

---

### Test 4: LuminEye On-Brand (Should PASS)

1. Enter your LuminEye test key: `narjes_lumineye_j5h9l2o6r3t8v1a4b7`
2. Select tool: **Veo 3**
3. Paste the same LuminEye content from Test 3
4. Click **Submit for Approval**
5. **Expected result:** ✅ "Script Approved" - now it matches the correct brand

---

### Test 5: Check Admin Dashboard

1. Go to: `https://your-app.vercel.app/admin.html`
2. Enter your admin password
3. You should see:
   - All your test submissions listed
   - Flagged items highlighted in red
   - Stats showing total requests, flagged count, etc.
4. Click on any prompt to see the full script

---

### Test 6: Check Email Alerts

For each flagged test (Tests 2 and 3), you should receive an email at narjes@w16media.co containing:

- Editor name (Narjes)
- Brand they're assigned to
- Tool they selected
- **The full script they tried to submit**
- Why it was flagged

---

## What You're Verifying

| Test | Verifies |
|------|----------|
| Test 1 | On-brand content gets approved |
| Test 2 | Completely off-brand content gets flagged |
| Test 3 | Cross-brand content (LuminEye content with Aurapets key) gets flagged |
| Test 4 | Correct brand matching works |
| Test 5 | Dashboard shows all activity |
| Test 6 | Email alerts work with full script |

---

## If Something Doesn't Work

### Portal shows error
- Check that your Vercel deployment succeeded
- Check environment variables are set correctly in Vercel

### Not receiving emails
- Check Resend API key is correct
- Check spam folder
- Verify ADMIN_EMAIL is set to narjes@w16media.co

### Classification seems wrong
- Check Groq API key is valid
- The AI may need clearer content to classify - very short prompts might be misclassified

---

## After Testing

Once all tests pass:

1. You're ready to distribute API keys to editors
2. Share the `EDITOR_INSTRUCTIONS.md` guide with them
3. Monitor the dashboard for any flagged submissions

---

## Quick Reference

| URL | Purpose |
|-----|---------|
| `https://your-app.vercel.app` | Editor Portal |
| `https://your-app.vercel.app/admin.html` | Admin Dashboard |
