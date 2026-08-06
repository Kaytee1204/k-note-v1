# K-Note - Task Board & Team Standup Workspace

A modern Notion/Excel-style workspace for managing task boards and Daily Standups, built for **Software Teams**. Includes Guest (view-only) mode alongside full Login/Register access.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma ORM
- **Styling**: TailwindCSS + Lucide React (Icons) + `next-themes` (Dark/Light Mode)
- **Form/Validation**: React Hook Form + Zod

---

## Design Style (Pink & Black Neon)

- **Dark Mode**: Deep matte black background (`bg-zinc-950`), dark cards (`bg-zinc-900`), subtle borders (`border-zinc-800`). Standout **Neon Pink** accent (`#ff2d75`).
- **Light Mode**: Light gray background (`bg-slate-50`), clean white cards, same Neon Pink accent for consistency.
- **Guest Mode**: Visitors can browse boards read-only without an account; login unlocks board creation and editing.
- **Board View**: Notion/Excel-style layout for organizing tasks by date and team member.

---

## Setup & Run Instructions

### 1. Navigate to the project directory

```bash
cd path/to/worklog-standup-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database (Supabase / PostgreSQL)

Open the `.env` file and replace it with your Supabase PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgboiler=true"
```

### 4. Push the Prisma schema & seed sample data

```bash
# Sync the database with the Prisma schema
npx prisma db push

# (Optional) Seed sample data for PM, DEV, TESTER
npx prisma db seed
```

### 5. Run the app in development mode

```bash
npm run dev
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 📁 Source Code Structure

```
k-note-app/
├── prisma/
│   ├── schema.prisma         # Prisma schema defining User & Board/Task models
│   └── seed.ts               # Script to seed sample Users & Tasks
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── tasks/        # GET (filter by date/pic), POST (create task)
│   │   │   │   └── [id]/     # PUT (edit/status), DELETE (remove)
│   │   │   ├── users/        # Fetch list of team members
│   │   │   └── seed/         # Endpoint to support auto-seeding
│   │   ├── boards/           # Board workspace page (guest view + editable)
│   │   ├── login/            # Login page
│   │   ├── register/         # Register page
│   │   ├── globals.css       # Tailwind & Neon Pink effects
│   │   ├── layout.tsx        # Root layout with ThemeProvider
│   │   └── page.tsx          # Auto-redirects to /boards
│   ├── components/
│   │   ├── filter-bar.tsx    # Filter bar for Date & PIC selection
│   │   ├── header.tsx        # Header with K-Note logo & ThemeToggle
│   │   ├── task-card.tsx     # Task display card with quick status toggle
│   │   ├── task-form-modal.tsx # Form modal for creating/editing tasks
│   │   ├── theme-provider.tsx# Dark/Light mode provider
│   │   └── theme-toggle.tsx  # Sun/Moon toggle button
│   ├── lib/
│   │   ├── prisma.ts         # Prisma Client singleton
│   │   └── utils.ts          # Date formatting & classname helpers
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── .env                      # Environment variables file for the database
├── tailwind.config.ts        # Pink & Black Neon color theme configuration
└── package.json
```
