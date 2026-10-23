🎯 FocusCraft (Productivity & Task Visualizer)

Build 2 Plan: CONFIRMED by Build 2 Planner on October 4, 2026[cite: 9].

📌 What the App Does & Who It's For

FocusCraft is a customizable digital to-do list app designed for students, friends, and teachers to manage daily tasks, track due dates, prioritize assignments, and decorate their workspace with custom visual themes and uploaded background images[cite: 9].

🔐 Sign-In & Authentication

Email and Password Sign-In: Requires password enforcement (8+ characters, uppercase letter, lowercase letter, number)[cite: 9].

GitHub OAuth Sign-In: Enabled for quick one-click authentication[cite: 9].

Session Persistence: Retains login state across browser refreshes with clear sign-out functionality[cite: 9].

Security Options: Dedicated change-password screen/form for authenticated email users[cite: 9].

Unique Username Onboarding: Mandatory username selection on first sign-in, displayed across the app in place of an email address[cite: 9].

🗄️ Database Schema & RLS Policies

Tables

profiles
- id (uuid, primary key, references auth.users)[cite: 9]
- username (text, unique)[cite: 9]
- created_at (timestamp)[cite: 9]

user_settings
- id (uuid, primary key)[cite: 9]
- user_id (uuid, references profiles.id)[cite: 9]
- selected_theme (text)[cite: 9]
- selected_font (text)[cite: 9]
- background_image_url (text)[cite: 9]

tasks
- id (uuid, primary key)[cite: 9]
- user_id (uuid, references profiles.id)[cite: 9]
- title (text)[cite: 9]
- start_date (date/timestamp)[cite: 9]
- due_date (date/timestamp)[cite: 9]
- priority (text: High, Medium, Low)[cite: 9]
- is_pinned (boolean, max 3 pinned per user)[cite: 9]
- is_completed (boolean)[cite: 9]
- completed_at (timestamp)[cite: 9]
- created_at (timestamp)[cite: 9]

👁️ Access & Visibility (Who Can See What)

profiles: Public Read (required for unique username checks); Insert/Update strictly restricted to the row owner (auth.uid() = id)[cite: 9].

user_settings: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id)[cite: 9].

tasks: Private. Select, insert, update, delete restricted strictly to the owner (auth.uid() = user_id)[cite: 9].

📦 Storage Buckets

Bucket Name: decorations[cite: 9]

File Size Limit: 5 MB per file[cite: 9]

Allowed File Types: image/jpeg, image/png, image/gif[cite: 9]

Access Rules: Authenticated upload to user-owned path (/user_id/*); read access restricted to owner[cite: 9].

🖥️ Application Screens

Sign-In / Sign-Up Screen: Email/Password registration & login, GitHub login button, and password reset option[cite: 9].

Username Setup Screen: Mandatory screen on initial login to select a unique username[cite: 9].

Main Dashboard: Workspace with task creation form, filter/sort toolbar (due date, priority), pin top 3 tasks feature, checklist actions, and theme/font customizer[cite: 9].

Task Archive Screen: View checked-off tasks completed within the last 30 days with full restoration or permanent deletion options[cite: 9].

📁 Code Files Structure

index.html: Contains all HTML structural markup and CSS styles; loads config.js prior to app.js[cite: 9].

app.js: Contains all JavaScript logic for auth, database queries, storage uploads, archive scheduling, and UI state rendering[cite: 9].

config.js: Holds only the Supabase URL and publishable key with fallback handling for preview mode[cite: 9].

📜 Rules for Every Chat

This app uses exactly three code files: index.html, app.js, config.js. Do not create more[cite: 9].

index.html contains the HTML and CSS, and loads config.js before app.js[cite: 9].

config.js contains only the Supabase URL and the publishable key[cite: 9].

When code changes are made, provide the entire updated file, never a snippet[cite: 9].

Change nothing that was not explicitly requested[cite: 9].

Never put a secret key in any file[cite: 9].

🌐 Project Addresses & Secrets

GitHub Pages URL: https://jazzotastical17.github.io/rep1/taskmaker67/index.html

GitHub Client Secret: Stored exclusively in the Supabase Dashboard under Auth Settings (never in code or project.md)[cite: 9].

📊 Where We Are Right Now

What's Built:
- Sign-in: GitHub and email/password sign-in, sign-out, and session kept across refresh (live on GitHub Pages, tested).
- Username onboarding: first sign-in asks for a unique username (3-20 letters, numbers, underscores). It shows in the nav bar and welcome card. NOT YET TESTED.
- Backgrounds: Add file (JPG/PNG/GIF, 5 MB, checked in the browser), real upload progress bar, list with Delete and Use as background, private signed URLs, choice saved in user_settings. NOT YET TESTED.
- Storage: decorations bucket is private, 5 MB, JPG/PNG/GIF. Policies for INSERT, SELECT and DELETE only allow the user's own folder (the delete policy adds an extra SELECT row, which is normal).

What's Broken / Needs Setup:
- Not tested end to end yet: username onboarding, uploads, deleting, saving the background in user_settings.
- Dashboard, Archive and Security buttons do nothing yet.
- Password rules, password reset and change-password are not built.
- Earlier versions of this file claimed full testing was done on Oct 6. That was wrong.

Next Thing I Want to Add:
Test username onboarding and background uploads on the live site, then build the task dashboard (add task, complete, pin up to 3, sort/filter).

📝 Change Log

October 4, 2026: Planning session with Build 2 Planner. Plan confirmed[cite: 9].

October 6, 2026: Created complete index.html structure and UI preview, updated config.js with safe preview fallback mode, and synced screen flow with app.js[cite: 9].

October 6, 2026: Connected live Supabase credentials, executed database table & RLS migration SQL script, and initialized decorations storage bucket[cite: 9].

October 6, 2026: Setup checks only (full end-to-end testing was not actually done)[cite: 9].

October 11, 2026: Resolved GitHub Pages 404 deployment paths, updated taskmaker67/config.js with live anon API credentials, refactored taskmaker67/app.js auth handling, cleaned broken HTML tags in taskmaker67/index.html, and verified live production setup[cite: 1, 2, 8].

October 22, 2026: Added username onboarding and background uploads (index.html and app.js). Set up decorations bucket policies. Corrected the status section. Not yet tested.