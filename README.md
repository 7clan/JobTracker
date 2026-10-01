# JobTracker

A lightweight React + TypeScript dashboard for tracking job applications locally in the browser.

## Features

- Add job applications with company, role, date, and status.
- Update application progress directly from each job card.
- Delete applications when they are no longer relevant.
- Search by company or role.
- Filter by application status.
- Sort by newest/oldest date, company, or status.
- Persist the application list in `localStorage` so data survives refreshes.
- Responsive dashboard UI with an animated particle background.

## Stack

- React 19
- TypeScript
- Vite
- CSS

## Local setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Data model

This project intentionally has no backend. Application records are stored under the browser-local key `viraljobs.jobs.v1`. That keeps the project simple and makes the trade-off explicit: data is device/browser specific and is not synchronized across machines.

## Project scope

JobTracker is a focused frontend project rather than a full recruiting platform. It demonstrates React state management, derived filtering/sorting, browser persistence, reusable components, and responsive UI work.

For larger systems and current work, see my GitHub profile: https://github.com/7clan
