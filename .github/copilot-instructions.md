# Copilot Instructions for BetterDay

## Project Overview
BetterDay is a mobile-first PWA for daily habit tracking with mood check-ins, reflections, AI coaching, and push reminders. It runs as a static site on Azure Static Web Apps.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (uses `@theme` block in `src/index.css`, NOT `tailwind.config.ts`)
- **State**: React Context + localStorage persistence (no Redux, no external state library)
- **AI**: Groq API (Llama 3.1 8B) via OpenAI-compatible REST endpoint
- **Browser APIs**: Web Speech API (`en-AU`), Notifications API
- **Infrastructure**: Azure Static Web Apps, Azure Functions (.NET 8), Azure Table Storage, Bicep IaC
- **CI/CD**: GitHub Actions

## Theming — Midnight Focus Dark Theme
All UI must use the custom CSS variables defined in `src/index.css`. Never use default Tailwind gray/white colors.

| Token              | Tailwind class       | Use for                     |
|--------------------|----------------------|-----------------------------|
| `--color-surface`       | `bg-surface`         | Card/panel backgrounds      |
| `--color-surface-light` | `bg-surface-light`   | Inputs, secondary surfaces  |
| `--color-text-primary`  | `text-text-primary`  | Headings, primary text      |
| `--color-text-secondary`| `text-text-secondary`| Labels, descriptions        |
| `--color-text-muted`    | `text-text-muted`    | Hints, placeholders         |
| `--color-border`        | `border-border`      | All borders                 |
| `--color-blue-soft`     | `bg-blue-soft`       | Primary buttons, accents    |
| `--color-green-gentle`  | `text-green-gentle`  | Success, completion states  |

**Do not** use `bg-white`, `bg-gray-100`, `text-gray-700`, or similar light-theme classes.

## Component Patterns
- **Controlled components**: Parent owns state, child receives values + callbacks via props.
- **Context pattern**: Each domain has its own Context + Provider (HabitContext, MoodContext, CoachContext, ReminderContext). Providers wrap the app in `App.tsx`.
- **localStorage persistence**: Contexts read from and write to localStorage. No backend API calls yet.
- **Pages** live in `src/pages/`, reusable UI in `src/components/{domain}/`, services in `src/services/`, contexts in `src/context/`.

## Styling Rules
- Use Tailwind utility classes exclusively. No inline `style={}` props, no CSS modules.
- Cards: `bg-surface rounded-lg p-4 border border-border shadow`
- Inputs: `bg-surface-light border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-soft focus:border-transparent`
- Buttons (primary): `bg-blue-soft text-white py-2.5 rounded-lg font-medium hover:bg-blue-soft-dark transition`
- Buttons (secondary): `bg-surface-light text-text-secondary border border-border rounded-lg`

## Code Style
- Minimal comments — only where logic is non-obvious.
- Small, focused components. Prefer composition over large monolithic files.
- Use named exports for components, default exports for pages.
- Environment variables must be prefixed with `VITE_` to be available in frontend code.

## Infrastructure
- Bicep modules live in `infra/modules/`. The orchestrator is `infra/main.bicep`.
- Azure SWA must deploy to `westus2` (not all regions support `Microsoft.Web/staticSites`).
- Do not expose secrets via Bicep outputs — use `existing` resource references instead of `listKeys()`.
- GitHub Actions workflows are in `.github/workflows/`.

## Testing
- Build: `npm run build` (runs `tsc -b && vite build`)
- Type check: `npx tsc --noEmit`
- E2E: Playwright (config in `playwright.config.ts`)
