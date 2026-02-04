# W16 Media - Editor Monitor System

A monitoring system that tracks AI tool usage by editors and alerts you when off-brand content is detected.

## Project Structure

```
editor-monitor/
│
├── api/                    # API endpoints (Vercel serverless functions)
│   ├── generate.js         # Main endpoint - editors submit requests here
│   ├── dashboard.js        # Admin dashboard data
│   └── editors.js          # Get all editor API keys
│
├── lib/                    # Core libraries
│   ├── brands.js           # Aurapets & LuminEye brand definitions
│   ├── classifier.js       # AI content classification (Groq)
│   ├── email.js            # Email alerts (Resend)
│   └── supabase.js         # Database client
│
├── config/                 # Configuration files
│   └── schema.sql          # Database schema for Supabase
│
├── public/                 # Frontend (web interfaces)
│   ├── index.html          # Editor portal
│   └── admin.html          # Admin dashboard
│
├── test/                   # Testing tools
│   ├── test-api.html       # Visual test interface
│   └── run-tests.js        # Command line test script
│
├── scripts/                # Utility scripts
│   └── generate-keys.js    # Generate new API keys
│
├── docs/                   # Documentation
│   ├── README.md           # Full documentation
│   └── EDITOR_API_KEYS.md  # All editor API keys
│
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
└── vercel.json             # Vercel deployment config
```

## Quick Start

1. See `docs/README.md` for full setup instructions
2. See `docs/EDITOR_API_KEYS.md` for editor API keys

## Tech Stack (100% Free)

- **Vercel** - Hosting
- **Supabase** - Database
- **Groq** - AI Classification
- **Resend** - Email Alerts
