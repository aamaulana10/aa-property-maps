# Property Management System

A modern property management system built with Next.js, Supabase, and Express.js. This application allows users to manage property listings with features like property creation, updating, deletion, and searching.

## Features

- 🏠 Property Management (CRUD operations)
- 🔍 Search and Filter Properties
- 💰 Price Range Filtering
- 🗺️ Google Maps Integration
- 🔐 Authentication with Supabase
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Express.js
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Project Structure

```plaintext
aa-property-maps/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── map/               # Property management page
│   └── page.tsx           # Main page
├── components/            # Reusable components
│   ├── property-form/     # Property form component
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
├── module/                # Business logic modules
│   ├── auth/             # Authentication module
│   └── map/              # Property management module
│       ├── entity/       # Data entities
│       ├── repository/   # Data access layer
│       ├── service/      # Business logic
│       └── usecase/      # Use cases
└── public/               # Static assets
```
