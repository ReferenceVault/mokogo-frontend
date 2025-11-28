# MOKOGO - Lister MVP Web App

A web application for listers to create and manage room/flat listings without brokers.

## Features

- **Flow 1**: Auth & Onboarding (Phone OTP + Email)
- **Flow 2**: Listing Creation Wizard (6 steps)
- **Flow 3**: Lister Dashboard & One Active Listing Rule
- **Flow 4**: Requests Management & Contact Privacy
- **Flow 5**: Draft Autosave & Resume

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Zustand (State Management)
- Tailwind CSS

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
│   ├── auth/      # Authentication flows
│   ├── listing/   # Listing wizard
│   └── requests/   # Request management
├── store/         # Zustand store
├── types/         # TypeScript types
└── App.tsx        # Main app component
```

## Brand Colors

- Primary Blue: `#1A73E8`
- Off-white: `#F7F9FC`
- Neutral Gray: `#E5E7EB`
