# BetterDay

A mobile-friendly Progressive Web App for daily habit tracking — built to help you be more present, calm, and connected with your family.

## What It Does

BetterDay helps you build and maintain positive daily habits with:

- **Daily habit tracking** — check off habits each day with a simple card-based UI
- **Streak tracking** — monitor your current and best streaks with a 30-day goal system
- **Mood check-ins** — rate your morning and evening mood (1–5 scale) and track trends over time
- **Daily reflections** — end-of-day journal prompts ("What went well? What to improve?")
- **Reports & analytics** — beautiful charts for completion rates, streak progress, category breakdowns, mood trends, and more
- **Milestone rewards** — earn badges at 7, 14, 21, and 30 days — including a "Date Night Unlocked! 🎉" celebration
- **Email summaries** — daily progress emails and weekly recaps sent automatically, plus an optional weekly email to your partner with an AI-generated loving quote
- **PWA support** — installable on your phone, works offline

## Default Habits

BetterDay ships with starter habits across four categories:

| Category | Habits |
|---|---|
| 📵 **Device Free** | Before Work, After Work, Weekend |
| 🏠 **Presence & Connection** | Device-Free Dinner, 10-Min 1-on-1 with Each Child, Eye Contact Conversation, Family Activity, Active Listening Moment |
| 😌 **Kindness & Calm** | Morning Calm Routine, No Raised Voice Day |
| 📝 **Accountability** | Daily Reflection Journal |

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18+, TypeScript, Vite, Tailwind CSS |
| **Backend** | Azure Functions (C#, serverless) |
| **Database** | Azure Table Storage |
| **Auth** | Microsoft (MSA) via Azure Static Web Apps built-in auth |
| **Hosting** | Azure Static Web Apps (free tier) |
| **IaC** | Bicep templates |
| **CI/CD** | GitHub Actions (separate pipelines for infra and app) |
| **AI** | Azure AI Foundry (for generating partner email quotes) |

## Project Structure

```
├── .github/workflows/    # CI/CD pipelines
├── api/                  # C# Azure Functions backend
│   ├── Functions/        # HTTP & Timer triggers
│   ├── Models/           # Table Storage entities
│   └── Services/         # Business logic & data access
├── infra/                # Bicep IaC templates
│   ├── modules/          # SWA, Functions, Storage, AI modules
│   └── parameters/       # Dev & Prod parameters
├── public/               # Static assets & PWA icons
└── src/                  # React frontend
    ├── components/       # UI components by feature
    ├── context/          # React Context providers
    ├── hooks/            # Custom hooks
    ├── pages/            # Route-level pages
    ├── services/         # API client & repository layer
    ├── types/            # TypeScript interfaces
    └── utils/            # Helpers & streak calculations
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environments

| Environment | Trigger | Approval |
|---|---|---|
| **Dev** | Auto-deploy on push to `main` | None |
| **Prod** | Manual promotion | Approval gate |

## License

Private project.
