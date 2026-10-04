# FocusCraft (Productivity & Task Visualizer)
Build 2 plan: CONFIRMED by Build 2 Planner on October 4, 2026.

## What the app does and who it's for
FocusCraft is a customizable digital to-do list app designed for students, friends, and teachers to manage daily tasks, track due dates, prioritize assignments, and decorate their workspace with custom visual themes and uploaded background images.

## Sign-in
- Email and password sign-in with password enforcement (8+ characters, uppercase, lowercase, number).
- GitHub OAuth sign-in.
- Session persistence across browser refreshes and sign-out capability.
- Dedicated change-password screen/form for email users.
- Unique username selection on first sign-in, displayed in place of email.

## Tables
1. **profiles**
   - `id` (uuid, primary key, references auth.users)
   - `username` (text, unique)
   - `created_at` (timestamp)

2. **user_settings**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `selected_theme` (text)
   - `selected_font` (text)
   - `background_image_url` (text)

3. **tasks**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `title` (text)
   - `start_date` (date/timestamp)
   - `due_date` (date/timestamp)
   - `priority` (text: High, Medium, Low)
   - `is_pinned` (boolean, max 3 pinned per user)
   - `is_completed` (boolean)
   - `completed_at` (timestamp)
   - `created_at` (timestamp)

## Who can see what
- **profiles**: Public read for unique username checks; insert/update restricted to row owner (`auth.uid() = id`).
- **user_settings**: Private. Select, insert, update, delete restricted strictly to the owner (`auth.uid() = user_id`).
- **tasks**: Private. Select, insert, update, delete restricted strictly to the owner (`auth.uid() = user_id`).

## Buckets
- **Bucket name**: `decorations`
- **File size limit**: 5 MB per file
- **Allowed file types**: `image/jpeg`, `image/png`, `image/gif`
- **Access rules**: Authenticated upload to user-owned path (`/user_id/*`); read access restricted to owner.

## Screens
1. **Sign-In / Sign-Up Screen**: Email/Password login & registration, GitHub login button, and Change Password option.
2. **Username Setup Screen**: Mandatory screen on initial login to select a unique username.
3. **Main Dashboard**: Workspace with task creation form, filter/sort (due date, priority), pin top 3 tasks, checklist actions, and background theme/font customization dropdown.
4. **Task Archive Screen**: View checked-off tasks completed within the last 30 days with full restoration or permanent deletion options.

## Code files
- `index.html`: Contains all HTML structural markup and CSS styles; loads `config.js` prior to `app.js`.
- `app.js`: Contains all JavaScript logic for auth, database queries, storage uploads, archive scheduling, and UI state rendering.
- `config.js`: Holds only the Supabase URL and publishable key.

## Rules for every chat
- This app uses exactly three code files: index.html, app.js, config.js. Do not create more.
- index.html contains the HTML and CSS, and loads config.js before app.js.
- config.js contains only the Supabase URL and the publishable key.
- When you change code, name the file and give me the whole file, not a snippet.
- Change nothing I did not ask you to change.
- Never put a secret key in any file.

## Addresses
- GitHub Pages URL: to fill in

## Secrets
- GitHub Client Secret: Stored exclusively in Supabase Dashboard under Auth Settings (never in code or project.md).

## Where we are right now
Planning complete, nothing built yet.

## NOT doing, on purpose
- Sharing lists with other users via Gmail or email invites (Deferred to Build 3: Requires server-side function / Vercel backend).
- Dynamic comment threads between users (Deferred to Build 3).
- Google Sign-In (Optional bonus feature for after core requirements are complete).

## Next thing I want to add
Set up Supabase sign-in settings, then email + password sign-in.

## Change log
- October 4, 2026: Planning session with Build 2 Planner. Plan confirmed.