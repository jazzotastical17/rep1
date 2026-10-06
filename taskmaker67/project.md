FocusCraft (Productivity & Task Visualizer)

Build 2 plan: CONFIRMED by Build 2 Planner on October 4, 2026.

What the app does and who it's for

FocusCraft is a customizable digital to-do list app designed for students, friends, and teachers to manage daily tasks, track due dates, prioritize assignments, and decorate their workspace with custom visual themes and uploaded background images.

Sign-in

Email and password sign-in with password enforcement (8+ characters, uppercase, lowercase, number).

GitHub OAuth sign-in.

Session persistence across browser refreshes and sign-out capability.

Dedicated change-password screen/form for email users.

Unique username selection on first sign-in, displayed in place of email.

Tables

profiles

id (uuid, primary key, references auth.users)

username (text, unique)

created_at (timestamp)

user_settings

id (uuid, primary key)

user_id (uuid, references profiles.id)

selected_theme (text)

selected_font (text)

background_image_url (text)

tasks

id (uuid, primary key)

user_id (uuid, references profiles.id)

title (text)

start_date (date/timestamp)

due_date (date/timestamp)

priority (text: High, Medium, Low)

is_pinned (boolean, max 3 pinned per user)

is_completed (boolean)

completed_at (timestamp)

created_at (timestamp)

Who can see what

profiles: Public read for unique username checks; insert/update restricted to row owner (auth.uid() = id).

user_settings: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id).

tasks: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id).

Buckets

Bucket name: decorations

File size limit: 5 MB per file

Allowed file types: image/jpeg, image/png, image/gif

Access rules: Authenticated upload to user-owned path (/user_id/*); read access restricted to owner.

Screens

Sign-In / Sign-Up Screen: Email/Password login & registration, GitHub login button, and Change Password option.

Username Setup Screen: Mandatory screen on initial login to select a unique username.

Main Dashboard: Workspace with task creation form, filter/sort (due date, priority), pin top 3 tasks, checklist actions, and background theme/font customization dropdown.

Task Archive Screen: View checked-off tasks completed within the last 30 days with full restoration or permanent deletion options.

Code files

index.html: Contains all HTML structural markup and CSS styles; loads config.js prior to app.js.

app.js: Contains all JavaScript logic for auth, database queries, storage uploads, archive scheduling, and UI state rendering.

config.js: Holds only the Supabase URL and publishable key with fallback handling for preview mode.

Rules for every chat

This app uses exactly three code files: index.html, app.js, config.js. Do not create more.

index.html contains the HTML and CSS, and loads config.js before app.js.

config.js contains only the Supabase URL and the publishable key.

When you change code, name the file and give me the whole file, not a snippet.

Change nothing I did not ask you to change.

Never put a secret key in any file.

Addresses

GitHub Pages URL: to fill in

Secrets

GitHub Client Secret: Stored exclusively in Supabase Dashboard under Auth Settings (never in code or project.md).

Where we are right now

What's working:

UI & Layout (index.html): Fully built responsive HTML layout featuring Tailwind CSS, Lucide icons, glassmorphism UI cards, theme/font customization panels, auth forms, username modal, dashboard task view, and archive view.

Config & Safety (config.js): Updated with safe initialization fallback so the app renders seamlessly in local preview mode without crashing on placeholder credentials.

Application Logic (app.js): Complete handler implementation for authentication, screen switching, task CRUD operations, sorting/filtering, theme dynamic styles, and storage upload handlers.

What's broken / needs setup:

Database tables (profiles, user_settings, tasks) and the decorations storage bucket need to be created in your Supabase project backend.

config.js currently uses placeholder values (YOUR_SUPABASE_URL_HERE, YOUR_SUPABASE_ANON_KEY_HERE) until real credentials are provided.

What I want to add next:

Connect live Supabase credentials into config.js.

Run database migration SQL to create the three required tables (profiles, user_settings, tasks) and configure security policies (RLS).

Create the decorations storage bucket for background image uploads.

Verify user registration, sign-in, and task creation end-to-end.

Next thing I want to add

Connect Supabase credentials and create tables/buckets in the Supabase Dashboard.

Change log

October 4, 2026: Planning session with Build 2 Planner. Plan confirmed.

October 6, 2026: Created complete index.html structure and UI preview, updated config.js with safe preview fallback mode, and synced screen flow with app.js.