🎯 FocusCraft (Productivity & Task Visualizer)

Build 2 Plan: CONFIRMED by Build 2 Planner on October 4, 2026.

📌 What the App Does & Who It's For

FocusCraft is a customizable digital to-do list app designed for students, friends, and teachers to manage daily tasks, track due dates, prioritize assignments, and decorate their workspace with custom visual themes and uploaded background images.

🔐 Sign-In & Authentication

Email and Password Sign-In: Requires password enforcement (8+ characters, uppercase letter, lowercase letter, number).

GitHub OAuth Sign-In: Enabled for quick one-click authentication.

Session Persistence: Retains login state across browser refreshes with clear sign-out functionality.

Security Options: Dedicated change-password screen/form for authenticated email users.

Unique Username Onboarding: Mandatory username selection on first sign-in, displayed across the app in place of an email address.

🗄️ Database Schema & RLS Policies

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

👁️ Access & Visibility (Who Can See What)

profiles: Public Read (required for unique username checks); Insert/Update strictly restricted to the row owner (auth.uid() = id).

user_settings: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id).

tasks: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id).

📦 Storage Buckets

Bucket Name: decorations

File Size Limit: 5 MB per file

Allowed File Types: image/jpeg, image/png, image/gif

Access Rules: Authenticated upload to user-owned path (/user_id/*); read access restricted to owner.

🖥️ Application Screens

Sign-In / Sign-Up Screen: Email/Password registration & login, GitHub login button, and password reset option.

Username Setup Screen: Mandatory screen on initial login to select a unique username.

Main Dashboard: Workspace with task creation form, filter/sort toolbar (due date, priority), pin top 3 tasks feature, checklist actions, and theme/font customizer.

Task Archive Screen: View checked-off tasks completed within the last 30 days with full restoration or permanent deletion options.

📁 Code Files Structure

index.html: Contains all HTML structural markup and CSS styles; loads config.js prior to app.js.

app.js: Contains all JavaScript logic for auth, database queries, storage uploads, archive scheduling, and UI state rendering.

config.js: Holds only the Supabase URL and publishable key with fallback handling for preview mode.

📜 Rules for Every Chat

This app uses exactly three code files: index.html, app.js, config.js. Do not create more.

index.html contains the HTML and CSS, and loads config.js before app.js.

config.js contains only the Supabase URL and the publishable key.

When code changes are made, provide the entire updated file, never a snippet.

Change nothing that was not explicitly requested.

Never put a secret key in any file.

🌐 Project Addresses & Secrets

GitHub Pages URL: To be filled in

GitHub Client Secret: Stored exclusively in the Supabase Dashboard under Auth Settings (never in code or project.md).

📊 Where We Are Right Now

What's Working:

UI & Layout (index.html): Fully responsive glassmorphism workspace with Tailwind CSS, Lucide icons, theme/font customizers, authentication modals, username prompt, task management lists, and task archive views.

Config & Backend Credentials (config.js): Connected to live Supabase backend with production API project credentials.

Database & Storage: profiles, user_settings, and tasks tables created with active RLS security policies. decorations storage bucket provisioned for image uploads.

Application Logic (app.js): Complete authentication flow, unique username validation, task CRUD operations with priority sorting and 3-task pinning limit, theme/font dynamic styling, background image uploads, and 30-day task archive cleanup.

End-to-End Live Testing: Verified signup/login, password enforcement, username creation, task CRUD/pinning, theme customization, media uploads, and archive restoration.

What's Broken / Needs Setup:

None. Core setup, database migrations, storage bucket configuration, and full end-to-end feature testing are complete.

What I Want to Add Next:

Deploy the web application to GitHub Pages and populate the live site URL in project.md.

⏩ Next Thing I Want to Add

Deployment to GitHub Pages & entering the live URL.

📝 Change Log

October 4, 2026: Planning session with Build 2 Planner. Plan confirmed.

October 6, 2026: Created complete index.html structure and UI preview, updated config.js with safe preview fallback mode, and synced screen flow with app.js.

October 6, 2026: Connected live Supabase credentials, executed database table & RLS migration SQL script, and initialized decorations storage bucket.

October 6, 2026: Completed end-to-end live testing across auth, username onboarding, task management, themes, background uploads, and archive features.