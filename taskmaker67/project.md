# 💛 FocusCraft — Project Progress & Documentation

## 📌 Project Overview

**Project Name:** FocusCraft  
**Project Type:** Web-Based Productivity & Task Management Application  
**Status:** Almost Complete — Final Submission Stage  
**Progress:** 9/10 Steps Completed

**Live Website:**  
https://jazzotastical17.github.io/rep1/taskmaker67/index.html

**GitHub Repository:**  
https://github.com/jazzotastical17/rep1

**Project Folder:** `taskmaker67`

### About FocusCraft

FocusCraft is a customizable productivity and task management web application designed to help users organize their responsibilities, manage deadlines, track progress, and personalize their workspace.

The application combines task management, user authentication, automatic task archiving, and appearance customization into one interface.

---

## 🛠️ Technologies Used

- **HTML5** — Application structure
- **CSS3 & Tailwind CSS** — Styling and responsive layout
- **JavaScript** — Application logic and interactions
- **Supabase Authentication** — Account registration, login, and password management
- **Supabase PostgreSQL** — Task storage
- **Supabase Storage** — Uploaded background images
- **GitHub OAuth** — Sign-in with GitHub
- **GitHub Pages** — Website hosting
- **Git & GitHub** — Version control
- **VS Code** — Development environment
- **Lucide Icons** — Interface icons

---

## ✅ Completed Features

### 1. Project Setup & Backup
- Initial project structure created
- GitHub repository configured
- GitHub Pages deployment configured
- Initial backup created

### 2. Authentication & Usernames
- Email and password registration
- Email confirmation
- Email and password login
- GitHub OAuth login
- Forgot-password recovery
- Password reset
- Username setup
- User profile display
- Sign-out functionality

### 3. Background Customization
- Upload custom background images
- Display selected backgrounds
- Remove uploaded backgrounds
- Supabase Storage integration
- File type and size validation
- Upload progress indicator

### 4. Task Dashboard
- Create new tasks
- Edit existing tasks
- Delete tasks
- Set task priorities
- Set start dates and deadlines
- Pin and unpin tasks
- Mark tasks completed
- Display task statistics
- Display completion progress

### 5. Task Organization
- Search tasks by title
- Filter tasks by completion status
- Filter by priority
- Filter by deadline
- Sort tasks
- Save organization preferences

### 6. Task Archive
- Dedicated Archive screen
- Automatically archive completed tasks
- Manually archive tasks
- Restore archived tasks
- Preserve archived task information
- Keep archived tasks out of the active dashboard
- Store archive status in Supabase

### 7. Account Security
- Dedicated Account Security screen
- Change-password form
- Password confirmation validation
- Minimum password length validation
- Supabase password update integration
- Success and error messages
- Return-to-dashboard navigation

**Security follow-up:** Review reauthentication requirements for sensitive account changes before final submission.

### 8. Appearance Customization
- Dedicated Appearance Settings screen
- Six accent color options
- Four font options: Inter, Poppins, Roboto, and Fira Code
- Live appearance preview
- Save preferences using browser local storage
- Restore default appearance
- Keep preferences after refreshing the page

### 9. Testing & Bug Fixes
- Authentication flows tested
- Task creation, editing, and deletion tested
- Task completion and automatic archiving tested
- Archive restoration tested
- Background customization tested
- Account Security interface tested
- Appearance settings tested
- Navigation tested
- Mobile layout checked

**Testing Result:** Manual testing reported successful. No automated testing or formal security audit has been completed.

---

## 📊 Development Roadmap

| Step | Feature | Status |
|---|---|---|
| 1 | Project Setup & Backup | ✅ Complete |
| 2 | Authentication & Usernames | ✅ Complete |
| 3 | Background Customization | ✅ Complete |
| 4 | Task Dashboard | ✅ Complete |
| 5 | Task Organization | ✅ Complete |
| 6 | Task Archive | ✅ Complete |
| 7 | Account Security | ✅ Functional |
| 8 | Appearance Customization | ✅ Complete |
| 9 | Testing & Bug Fixes | ✅ Complete |
| 10 | Final Submission | ⏳ Next |

**Overall Progress: 90%**

---

## 🔐 Data & Security

- Supabase Authentication manages user accounts.
- Tasks are linked to individual user IDs.
- Supabase Row Level Security policies restrict access to user-specific data.
- Passwords are handled by Supabase Authentication.
- Completed tasks record completion and archive timestamps.
- Appearance preferences are stored locally in the user's browser.

### Remaining Security Checks
- Review reauthentication for password changes.
- Verify Supabase redirect URLs.
- Verify Row Level Security policies.
- Ensure no secret service-role keys are exposed in frontend code.

---

## 🚀 Current Project Status

FocusCraft's planned core features have been implemented and manually tested.

The application currently supports authentication, task management, task organization, automatic archiving, background customization, and appearance preferences.

The project is entering its final submission and documentation stage.

---

## 🏁 Step 10 — Final Submission Checklist

- [ ] Create a final GitHub backup or release tag
- [ ] Confirm the latest GitHub Pages deployment works
- [ ] Review repository contents
- [ ] Complete final security checks
- [ ] Prepare final project description
- [ ] Prepare screenshots or demonstration materials if required
- [ ] Submit the website and repository links

---

## 💛 Project Goal

The goal of FocusCraft is to provide a simple, organized, customizable workspace that helps users stay focused, manage responsibilities, and track their productivity.

**Current Status: 10/10 Steps Completed — Ready for Final Submission!**