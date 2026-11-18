# Spendly — Personal Finance Manager

Spendly is a responsive personal finance dashboard built with React and Vite. It demonstrates a complete front-end capstone workflow: simulated authentication, transaction CRUD, search and filtering, category summaries, charts, CSV export, and browser-based persistence.

## Features

- **Demo authentication:** enter a name and email to access the dashboard. No real password or backend authentication is used.
- **Dashboard overview:** balance, income, expenses, transaction count, cash-flow chart, and spending breakdown.
- **Transaction CRUD:** create, read, edit, and delete income or expense records.
- **Search and filters:** search by title, category, or note; filter by income or expenses.
- **Persistent state:** transactions and demo user details are stored in `localStorage`.
- **Categories:** see expense totals grouped by category.
- **CSV export:** download transaction records for use in a spreadsheet.
- **Responsive UI:** sidebar and dashboard adapt to smaller screens.

## Tech stack

- React 18
- Vite
- Recharts
- Lucide React
- CSS
- Browser `localStorage`

## Run locally

1. Install Node.js (LTS).
2. Extract this ZIP and open the `spendly-capstone` folder in VS Code.
3. Open a terminal in that folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

Vite creates the production-ready site in the `dist` folder.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Keep the framework preset as **Vite**.
5. Set Build Command to `npm run build` and Output Directory to `dist`.
6. Select **Deploy**. Vercel will provide a public URL.

You can also deploy the same Vite project to Netlify using `npm run build` and `dist` as the publish directory.

## Project structure

```text
spendly-capstone/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── docs/
│   └── architecture.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the application flow and component responsibilities.

## Important limitations

This capstone is a front-end demonstration. Authentication is simulated and data is saved only in the current browser's local storage. There is no server, database, secure account system, or cross-device synchronization. Do not enter real financial account credentials or sensitive information.

## Suggested evaluation checklist

- [ ] Sign in with a name and valid email.
- [ ] Add an income record and confirm the totals update.
- [ ] Add an expense record and confirm the chart and category breakdown update.
- [ ] Edit a transaction.
- [ ] Delete a transaction.
- [ ] Search and filter transactions.
- [ ] Refresh the page and confirm records remain.
- [ ] Export the transactions as CSV.
- [ ] Check the layout on a mobile-sized screen.
