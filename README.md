# PlanForge — Collaborative Productivity Platform

PlanForge is a production-quality collaborative planning and execution platform built for small teams, hackathons, learning journeys, college projects, coding projects, and competitions.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS), Supabase Auth, Supabase Realtime
- **AI Integrations**: Automated Hierarchical Roadmap Generator & Real-time Workspace Risk Analyzer

---

## Required Environment Variables

To run PlanForge, create a `.env.local` file in the root directory (based on `.env.example`).

```env
# Supabase Project Credentials (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

# Supabase Server-Side Key (Only accessible server-side)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Api Key for Roadmap & Risk Endpoints
AI_API_KEY=your_gemini_or_openai_api_key

# Developer Demo Seeder (Set to 'true' in development to seed mock database data)
NEXT_PUBLIC_SEED_DEMO_DATA=false
```

---

## Setup & Database Migration Instructions

### 1. Local Setup
1. Clone the repository and navigate to the project directory.
2. Install the node modules:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill out the environment variables in `.env.local`.

### 2. Supabase Database Migration
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** tab from the left sidebar.
4. Open the SQL migration file: [supabase/schema.sql](file:///Users/sushanth/project/project%20gov/database/homies/supabase/schema.sql)
5. Copy the entire contents of the file and paste them into the Supabase SQL Editor.
6. Run the script. This will provision:
   - All 11 tables (`profiles`, `workspaces`, `workspace_members`, `goals`, `milestones`, `tasks`, `subtasks`, `tags`, `task_tags`, `comments`, `notifications`, `activity_events`).
   - Strict Row Level Security (RLS) policies enforcing private workspace boundaries.
   - Profile auto-provisioning triggers on Auth signup.
   - Database replication subscriptions for Supabase Realtime synchronization.

### 3. Running Development Commands
- Start the local development server:
  ```bash
  npm run dev
  ```
- Build the production bundle:
  ```bash
  npm run build
  ```
- Start the production build locally:
  ```bash
  npm start
  ```
- Run linting and formatting validation:
  ```bash
  npm run lint
  ```

---

## Production Deployment Instructions (Vercel)

### 1. Deployment Configuration
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set the build commands:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Vercel Environment Variables
Add the following key-value pairs in the **Environment Variables** section of your Vercel project configuration:
- `NEXT_PUBLIC_SUPABASE_URL`: (Your public Supabase project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your public Supabase anon key)
- `SUPABASE_SERVICE_ROLE_KEY`: (Your secret service role key - server side only)
- `AI_API_KEY`: (Your Gemini or OpenAI API Key - server side only)
- `NEXT_PUBLIC_SEED_DEMO_DATA`: `false` (Ensures mock workspaces are not created on initial sign up in production)

---

## Security & Row Level Security (RLS) Boundaries
PlanForge enforces strict RLS rules in PostgreSQL:
1. **Workspace Boundary**: Users can only query workspaces they are registered to in `workspace_members`.
2. **Workload, Tasks, Goals & Comments**: Query operations are filtered by active workspace membership checks.
3. **Notifications**: Private notifications can only be read/updated by their recipient user (`auth.uid()`).
4. **Service Keys**: The `SUPABASE_SERVICE_ROLE_KEY` is not exposed in public env parameters and runs server-side only.
