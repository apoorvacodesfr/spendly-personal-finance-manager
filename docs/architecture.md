# Spendly application architecture

## High-level flow

```text
User
  |
  v
React UI (App.jsx)
  |
  +--> Demo Login form
  |
  +--> Dashboard / Transactions / Categories
  |       |
  |       +--> Transaction form (create / edit)
  |       +--> Transaction table (read / delete)
  |       +--> Search and type filters
  |       +--> Recharts visualizations
  |
  v
React state
  |
  +--> localStorage: spendly-user
  +--> localStorage: spendly-transactions
```

## Main responsibilities

- `src/main.jsx`: mounts the React application and imports global styles.
- `src/App.jsx`: owns application state, navigation, calculations, transaction CRUD, CSV export, login form, dashboard, and reusable UI components.
- `src/styles.css`: contains responsive layout, component styling, and mobile breakpoints.
- `package.json`: declares React, Vite, Recharts, and Lucide React dependencies.
- `README.md`: setup, build, deployment, feature list, and limitations.

## Data model

Each transaction uses this shape:

```js
{
  id: 1710000000000,
  title: "Grocery shopping",
  category: "Food",
  date: "2026-11-04",
  amount: 1850,
  type: "expense",
  note: "Weekly groceries"
}
```

## Persistence

The application initializes its React state from `localStorage`. A React effect writes updated transactions and user details back to local storage. This provides persistence after a browser refresh on the same device and browser profile. It is not a replacement for a server-side database.
