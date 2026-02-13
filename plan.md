# BetterDay — Implementation Plan

## Problem
Build **BetterDay**, a mobile-friendly Progressive Web App (PWA) for daily habit tracking with streak stats, browser notifications, and Azure-backed storage.

## Tech Stack
- **Framework:** React 18+ (with Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (utility-first, mobile-first)
- **UI Layout:** Bottom tab navigation (mobile app feel)
- **Theme:** Calm & Warm — soft blues (#6B9BD2), warm grays (#F5F5F0), gentle greens (#7CB69D)
- **Habit Display:** Card-based — each habit as a card with toggle switch + streak badge
- **Storage:** Azure Table Storage (backend) + localStorage cache (offline support)
- **Backend:** Azure Functions (C#, serverless, pay-per-use)
- **Database:** Azure Table Storage
- **PWA:** Vite PWA plugin (service worker, manifest, installable)
- **Hosting:** Azure Static Web Apps (free tier) — Dev + Prod environments
- **CI/CD:** GitHub Actions — separate pipelines for infra (Bicep) and app deploy
- **IaC:** Bicep templates for all Azure resources (Static Web Apps, AI Foundry)
- **Environments:** Dev (auto-deploy on push) + Prod (manual approval gate)
- **Repo:** `RangerDjanger/Habit-tracker`
- **Auth:** Microsoft Live (MSA) via Azure Static Web Apps built-in auth, restricted to single user (`davejansen@live.com.au`)
- **Project Location:** `C:\Users\dajansen\Projects\habit-tracker`

## Architecture

### Data Model
```ts
interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdAt: string;       // ISO date
  reminderTime?: string;   // HH:mm format
  activeDays: number[];    // 0=Sun, 1=Mon, ..., 6=Sat. Empty = every day
  archived: boolean;
}

interface HabitLog {
  habitId: string;
  date: string;            // YYYY-MM-DD
  completed: boolean;
}

interface Reflection {
  date: string;            // YYYY-MM-DD
  wentWell: string;
  toImprove: string;
}

interface MoodEntry {
  date: string;            // YYYY-MM-DD
  morning?: number;        // 1-5
  evening?: number;        // 1-5
}

interface Milestone {
  days: number;            // 7, 14, 21, 30
  label: string;           // e.g., "Date Night Unlocked! 🎉"
  achieved: boolean;
}

interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  streakGoal: number;          // default: 30 days
  streakGoalComplete: boolean; // currentStreak >= streakGoal
}
```

### Storage Abstraction
A `HabitRepository` interface so localStorage can be swapped for an API client later:
```ts
interface HabitRepository {
  getHabits(): Habit[];
  saveHabit(habit: Habit): void;
  deleteHabit(id: string): void;
  getLogsForHabit(habitId: string): HabitLog[];
  logHabit(log: HabitLog): void;
}
```

### Key Components
- `App` — layout shell, routing
- `HabitList` — today's habits with check-off toggles
- `HabitForm` — add/edit a habit (name, description, reminder time)
- `HabitDetail` — view stats (current streak, best streak, total completions), calendar heatmap
- `StreakBadge` — visual streak indicator
- `NotificationManager` — requests permission, schedules daily reminders

## Workplan

### Phase 1 — Project Scaffolding
- [ ] Create project directory and initialize Vite + React + TypeScript
- [ ] Install dependencies (react-router, vite-plugin-pwa, tailwindcss, @tailwindcss/forms, recharts)
- [ ] Configure PWA manifest (name: "BetterDay", icons, theme color: Calm & Warm palette)
- [ ] Set up basic folder structure (`components/`, `hooks/`, `services/`, `types/`)
- [ ] Add a mobile-first Tailwind config with Calm & Warm theme (custom colors: soft blue, warm gray, gentle green)
- [ ] Build bottom tab navigation bar (Today, Reports, Reflect, Settings)
- [ ] Build login page with "Sign in with Microsoft" button
- [ ] Add logout button in Settings page
- [ ] Handle auth state (redirect to login if unauthenticated)
- [ ] Initialize Git repo, create `RangerDjanger/Habit-tracker` on GitHub, push initial commit

### Phase 1b — Infrastructure & CI/CD
- [ ] Create `infra/` folder with Bicep templates:
  - `infra/main.bicep` — orchestrator module
  - `infra/modules/static-web-app.bicep` — Azure Static Web Apps (Dev + Prod)
  - `infra/modules/function-app.bicep` — Azure Functions (C#) + Storage Account
  - `infra/modules/table-storage.bicep` — Azure Table Storage tables
  - `infra/modules/ai-foundry.bicep` — Azure AI Foundry resource
  - `infra/parameters/dev.bicepparam` — Dev environment parameters
  - `infra/parameters/prod.bicepparam` — Prod environment parameters
- [ ] Create GitHub Actions workflow: `.github/workflows/infra.yml`
  - Triggers on changes to `infra/` folder
  - Uses Azure Login action (OIDC / service principal)
  - Runs `az deployment group create` with Bicep for Dev and Prod
  - Separate jobs per environment with manual approval gate for Prod
- [ ] Create GitHub Actions workflow: `.github/workflows/deploy.yml`
  - Triggers on push to `main` branch
  - Builds Vite app (`npm run build`)
  - Deploys to Azure Static Web Apps (Dev on push, Prod with manual approval)
- [ ] Configure GitHub repository secrets:
  - `AZURE_CREDENTIALS` — service principal for Azure login
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` — deploy token for Dev
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` — deploy token for Prod
- [ ] Create GitHub Actions workflow: `.github/workflows/deploy-functions.yml`
  - Triggers on changes to `api/` folder
  - Builds C# Azure Functions project
  - Deploys to Azure Functions (Dev on push, Prod with manual approval)
- [ ] Create GitHub Issue: "Feature: Apple Health Sleep Score Integration"

### Phase 2 — Backend (Azure Functions + Table Storage)
- [ ] Create `api/` folder with C# Azure Functions project (`dotnet new func`)
- [ ] Define Table Storage entities: `HabitEntity`, `HabitLogEntity`, `ReflectionEntity`, `MoodEntryEntity`, `UserSettingsEntity`
- [ ] Implement Azure Functions HTTP endpoints:
  - `GET/POST/PUT/DELETE /api/habits` — CRUD for habits
  - `GET/POST /api/habits/{id}/logs` — log habit completions
  - `GET /api/habits/{id}/stats` — streak & stats calculation
  - `GET/POST /api/reflections` — daily reflection journal
  - `GET/POST /api/mood` — mood check-in entries
  - `GET/PUT /api/settings` — user settings (email, wife's email, API keys)
- [ ] Implement Timer-triggered Functions:
  - `DailyEmailFunction` — runs at 9 PM, sends daily progress email via SendGrid/SMTP
  - `WeeklyEmailFunction` — runs Sunday 9 PM, sends weekly recap + wife's email with AI quote
  - `QuoteGeneratorFunction` — calls Azure AI Foundry to generate loving quote (key stored server-side securely)
- [ ] Configure Azure Table Storage connection string via app settings
- [ ] Add authentication (API key or Azure AD B2C for future multi-user support)
- [ ] Configure Azure Static Web Apps built-in auth with Microsoft (AAD) provider
- [ ] Add `staticwebapp.config.json` with route restrictions — require login for all routes
- [ ] Restrict access to single user: `davejansen@live.com.au` via invite-based role assignment
- [ ] Pass authenticated user identity from Static Web Apps to Azure Functions via `x-ms-client-principal` header
- [ ] Validate user identity in Azure Functions (reject requests from unauthorized users)

### Phase 3 — Data Layer (Frontend)
- [ ] Define TypeScript types (`Habit`, `HabitLog`, `HabitStats`)
- [ ] Implement `HabitRepository` interface
- [ ] Implement `ApiHabitRepository` (calls Azure Functions endpoints)
- [ ] Implement localStorage cache layer for offline support (sync when back online)
- [ ] Implement streak/stats calculation utility (`calcStreak`, `calcStats`)
- [ ] Seed default habits on first launch (5 categories, 11 habits + 2 trackers):
  - **📵 Phone Free:** "Phone Free Before Work", "Phone Free After Work", "Phone Free Weekend"
  - **🏠 Presence & Connection:** "Device-Free Dinner", "10-Minute 1-on-1 with Each Child", "Eye Contact Conversation", "Family Activity", "Active Listening Moment"
  - **😌 Kindness & Calm:** "Morning Calm Routine", "No Raised Voice Day"
  - **📝 Accountability:** "Daily Reflection Journal" (end-of-day prompt: what went well / what to improve)
  - **😊 Mood:** Morning & evening mood check-in (1–5 scale, tracked over time)
- [ ] Create React Context + custom hooks (`useHabits`, `useHabitStats`)

### Phase 4 — Core UI
- [ ] Build `HabitList` — today view showing only habits active for current day, with card toggles + streak badges
- [ ] Build `HabitForm` — add/edit habit with name, description, reminder time, and active days picker (Mon–Sun toggles, default: every day)
- [ ] Build `ManageHabits` — dedicated page to view all habits, add new, edit, reorder, and delete habits (with confirmation)
- [ ] Build `HabitDetail` — stats display (current streak, best streak, total completions, 30-day goal progress)
- [ ] Build `StreakGoalProgress` — visual progress bar/ring showing progress toward 30-day streak goal with celebration state on completion
- [ ] Build `DailyReflection` — end-of-day journal prompt ("What went well? What to improve?") stored per day
- [ ] Build `MoodCheckIn` — morning & evening mood rating (1–5 emoji scale), with mood trend chart over time
- [ ] Build `RewardSystem` — milestone badges at 7, 14, 21, 30 days with confetti animation; "Date Night Unlocked! 🎉" celebration at 30-day streak
- [ ] Build `ReportsPage` — beautiful charts/graphs (Recharts) including:
  - **Overall Completion Rate** — area chart showing daily/weekly % of habits completed over time
  - **Streak Progress** — radial/ring chart per habit showing progress toward 30-day goal
  - **Category Breakdown** — stacked bar chart (Phone Free vs Presence vs Calm) showing which areas are strongest
  - **Mood Trend** — line chart overlaying morning & evening mood scores over time
  - **Weekly Heatmap** — GitHub-style contribution grid showing completions per day
  - **Best Streaks Leaderboard** — ranked list of habits by best streak with trophy icons
  - **Consistency Score** — single big number (0–100%) with trend arrow, showing overall habit adherence
  - **Shareable Summary Card** — tap to generate a beautiful summary image to share with wife
- [ ] Add routing: `/login`, `/` (today), `/manage`, `/add`, `/habit/:id/edit`, `/habit/:id`, `/reflect`, `/reports`, `/settings`
- [ ] Responsive mobile-first layout (bottom nav or swipe-friendly)

### Phase 5 — Notifications & Email
- [ ] Request notification permission on first launch
- [ ] Schedule browser notifications at each habit's reminder time
- [ ] Handle notification click (open app to today view)
- [ ] Build email templates (server-side in Azure Functions):
  - Daily progress email: each habit (✅/❌), current streak, 30-day goal progress
  - Weekly recap email: 7-day grid, completion %, streak progress, next week commitment
  - Wife's weekly email: AI-generated loving quote + progress summary
- [ ] Curate a fallback collection of 10 loving/marriage quotes (used if AI generation fails)
- [ ] Prompt user for email address and wife's email in settings page
- [ ] Emails sent reliably server-side via Timer-triggered Azure Functions (no browser required)

### Phase 6 — PWA & Polish
- [ ] Configure service worker for offline support
- [ ] Add app icons (multiple sizes) and splash screen
- [ ] Add "install app" prompt for mobile browsers
- [ ] Add empty states, loading states, and micro-animations
- [ ] Test on mobile (Chrome DevTools device mode)

### Phase 7 — Stretch (Optional)
- [ ] Calendar heatmap view on habit detail page
- [ ] Export/import data as JSON (backup)
- [ ] Dark mode toggle
- [ ] Habit categories/tags
- [ ] Apple Health sleep score integration (requires native companion app or backend — see GitHub Issue)

## Notes
- The storage abstraction layer is the key architectural decision — the frontend talks to Azure Functions APIs, with a localStorage cache for offline support.
- **Azure Functions (C#)** handle all server-side logic: API endpoints, email scheduling (Timer triggers), and Azure AI Foundry calls. API keys never touch the browser.
- **Azure Table Storage** stores all data: habits, logs, reflections, mood entries, user settings. Cheapest option with partition/row key design for fast queries.
- **Emails sent server-side** — Timer-triggered Azure Functions send daily (9 PM) and weekly (Sunday 9 PM) emails reliably, even if the browser is closed.
- Browser Notification API requires HTTPS or localhost; the PWA service worker handles this naturally.
- **Daily email summary** includes: each habit's status (✅/❌), current streak count, progress toward 30-day goal (e.g., "Day 12/30"), and best streak.
- **Weekly email** includes: 7-day completion grid per habit (Mon–Sun ✅/❌), weekly completion percentage, streak progress toward 30-day goal, and a "next week commitment" section.
- **Wife's weekly email** also sent Sunday at 9:00 PM. A separate, warmer email with a unique AI-generated loving quote (via Azure AI Foundry) + a summary of your progress. Falls back to curated quotes if AI call fails. Wife's email is optional and configured in settings.
- Streaks only count active days — e.g., a Mon/Wed/Fri habit won't break its streak on Tuesday. The 30-day goal counts 30 *completed active days*, not calendar days.
- **Streak goal is 30 days minimum.** Each habit shows progress toward the 30-day goal (e.g., "Day 12 of 30") with a visual indicator. Completing 30 days triggers a celebration/badge.
- **Starting habits:** On first launch, the app seeds 9 default habits across 3 categories:
  - 📵 **Phone Free:** Before Work, After Work, Weekend
  - 🏠 **Presence:** Device-Free Dinner, 10-Min 1-on-1 with Each Child, Eye Contact Conversation, Family Activity, Active Listening Moment
  - 😌 **Calm:** Morning Calm Routine (5 min breathing/meditation), No Raised Voice Day
  Users can edit, delete, or add more habits at any time.
- **Apple Health integration** is not possible from a PWA (HealthKit is native iOS only). Deferred to a future phase requiring a native companion app or backend. Tracked via GitHub Issue.

## GitHub Issues to Create
- [ ] **Feature: Apple Health Sleep Score Integration** — Integrate Apple Health sleep data to correlate with mood. Requires either a native iOS companion app to read HealthKit and sync to a backend, or a third-party health data API (e.g., Thryve). Blocked until a backend is implemented. Labels: `enhancement`, `future`.
