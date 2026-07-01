# Money Tracker

A client-side personal finance tracker with a monochromatic NothingOS-inspired UI. Add income and expense transactions, view spending breakdowns by category, and export reports — all stored locally in your browser.

## Overview

Most finance apps require an account, send your data to a server, or bury simple features behind paywalls. Money Tracker is a single HTML file's worth of JavaScript that runs entirely in your browser. There is no backend, no registration, no telemetry. Your financial data never leaves your device. The interface follows a monochromatic design philosophy inspired by Nothing OS — black, white, and gray only, with typographic hierarchy and spacing doing the work that colour usually carries.

## Features

- **Transaction management** — Add income or expense transactions with a title, amount, category, and date. Delete individual entries.
- **Monthly overview** — See total income, total expense, and net balance for the current month, alongside a sortable transaction list.
- **Financial analysis** — Switch between monthly and annual views. Filter by any period. See a category breakdown of expenses with proportional progress bars.
- **CSV reporting** — Select a month or year, preview the summary statistics, then download a CSV file compatible with Excel and Google Sheets.
- **Category management** — Add and remove custom categories from the Settings panel.
- **Dark / light theme** — Toggle between themes. Preference is persisted in localStorage.
- **Zero external dependencies for runtime** — Aside from React and ReactDOM, no runtime libraries are used. No state management library, no CSS framework, no icon library.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | CSS3 (custom properties, Grid, Flexbox) |
| Persistence | Browser localStorage |
| Linting | ESLint 8 + plugins (react, react-hooks, react-refresh) |
| Prop validation | PropTypes |

## Installation

**Prerequisites:** Node.js 16+ and npm (or your package manager of choice).

```bash
git clone <repo-url>
cd money-tracker
npm install
npm run dev
```

The development server starts at `http://localhost:5173`. For a production build:

```bash
npm run build
npm run preview
```

The built output is written to `dist/` and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Usage

### Adding a transaction

Fill out the form on the left panel: enter a title, set the amount, choose **Expense** or **Income**, optionally pick a category, and select a date. Click **Add Transaction** — it appears immediately in the right panel's transaction list and updates the summary cards.

### Viewing analysis

Click the half-circle icon in the floating nav to open **Analysis**. Choose **Monthly** or **Annual**, then pick a specific month and year. The four stat cards show total income, expense, net balance, and transaction count for that period. Expense categories are listed below with a visual breakdown bar.

### Exporting a report

Click the download icon in the floating nav to open **Reports**. Select the report type (Monthly/Annual) and the period, then click **Download as CSV**. The file includes both the individual transactions and a summary section with totals.

### Managing categories

Click the gear icon to open **Settings**. Add new categories via the text input, or remove existing ones with the × button. Categories appear in the transaction form's dropdown and in the analysis breakdown.

### Changing theme

In **Settings**, toggle the theme switch between dark and light. The change applies immediately and persists across sessions.

## Configuration

No environment variables, config files, or flags are required. The entire application is configured through the UI. Data is stored under the `transactions`, `categories`, and `theme` keys in `window.localStorage`.

## Project Structure

```
money-tracker/
├── index.html              # HTML shell — loads the app
├── vite.config.js          # Vite configuration (React plugin)
├── .eslintrc.cjs           # ESLint config
├── public/
│   └── vite.svg            # Favicon
└── src/
    ├── main.jsx            # React entry point, mounts <App> inside <ThemeProvider>
    ├── App.jsx             # Root component — owns all state, two-column layout
    ├── App.css             # All styles (1400+ lines), dark/light themes via CSS vars
    ├── hooks/
    │   └── useLocalStorage.js   # Syncs React state with localStorage
    ├── contexts/
    │   └── ThemeContext.jsx     # Dark/light theme context + provider
    └── components/
        ├── FloatingNav.jsx     # Fixed side nav: Overview / Analysis / Reports / Settings
        ├── TransactionForm.jsx # Left panel: transaction input form
        ├── TransactionList.jsx # Right panel: sortable transaction list with delete
        ├── Summary.jsx         # Income / Expense / Balance summary cards
        ├── Analysis.jsx        # Monthly/annual breakdown with category bars
        ├── Reports.jsx         # CSV export with period config and preview
        └── Settings.jsx        # Theme toggle, category CRUD, clear all data
```

## Testing

No test suite is currently configured. The project uses no test framework.

## License

This project does not specify a license.
