💛 FocusCraft — Project Progress & Documentation
📌 Project Overview
Project Name: FocusCraft
Project Type: Web-Based Productivity & Task Management Application
Status: Almost Complete — Final Submission Stage
Progress: 9/10 Steps Completed

Live Website:
https://jazzotastical17.github.io/rep1/taskmaker67/index.html

GitHub Repository:
https://github.com/jazzotastical17/rep1

Project Folder: taskmaker67
About FocusCraft
FocusCraft is a customizable productivity and task management web application designed to help users organize their responsibilities, manage deadlines, track progress, and personalize their workspace.

The application combines task management, user authentication, automatic task archiving, and appearance customization into one interface.
🛠️ Technologies Used
- HTML5 — Application structure
- CSS3 & Tailwind CSS — Styling and responsive layout
- JavaScript — Application logic and interactions
- Supabase Authentication — Account registration, login, and password management
- Supabase PostgreSQL — Task storage
- Supabase Storage — Uploaded background images
- GitHub OAuth — Sign-in with GitHub
- GitHub Pages — Website hosting
- Git & GitHub — Version control
- VS Code — Development environment
- Lucide Icons — Interface icons
✅ Completed Features
1. Project Setup & Backup
- Initial project structure created
- GitHub repository configured
- GitHub Pages deployment configured
- Initial backup created
2. Authentication & Usernames
- Email and password registration
- Email confirmation
- Email and password login
- GitHub OAuth login
- Forgot-password recovery
- Password reset
- Username setup
- User profile display
- Sign-out functionality
3. Background Customization
- Upload custom background images
- Display selected backgrounds
- Remove uploaded backgrounds
- Supabase Storage integration
- File type and size validation
- Upload progress indicator
4. Task Dashboard
- Create new tasks
- Edit existing tasks
- Delete tasks
- Set task priorities
- Set start dates and deadlines
- Pin and unpin tasks
- Mark tasks completed
- Display task statistics
- Display completion progress
5. Task Organization
- Search tasks by title
- Filter tasks by completion status
- Filter by priority
- Filter by deadline
- Sort tasks
- Save organization preferences
6. Task Archive
- Dedicated Archive screen
- Automatically archive completed tasks
- Manually archive tasks
- Restore archived tasks
- Preserve archived task information
- Keep archived tasks out of the active dashboard
- Store archive status in Supabase
7. Account Security
- Dedicated Account Security screen
- Change-password form
- Password confirmation validation
- Minimum password length validation
- Supabase password update integration
- Success and error messages
- Return-to-dashboard navigation
Security follow-up: Review reauthentication requirements for sensitive account changes before final submission.
8. Appearance Customization
- Dedicated Appearance Settings screen
- Six accent color options
- Four font options: Inter, Poppins, Roboto, and Fira Code
- Live appearance preview
- Save preferences using browser local storage
- Restore default appearance
- Keep preferences after refreshing the page
9. Testing & Bug Fixes
- Authentication flows tested
- Task creation, editing, and deletion tested
- Task completion and automatic archiving tested
- Archive restoration tested
- Background customization tested
- Account Security interface tested
- Appearance settings tested
- Navigation tested
- Mobile layout checked
Testing Result: Manual testing reported successful. No automated testing or formal security audit has been completed.
📊 Development Roadmap
Step	Feature	Status
1	Project Setup & Backup	✅ Complete
2	Authentication & Usernames	✅ Complete
3	Background Customization	✅ Complete
4	Task Dashboard	✅ Complete
5	Task Organization	✅ Complete
6	Task Archive	✅ Complete
7	Account Security	✅ Functional
8	Appearance Customization	✅ Complete
9	Testing & Bug Fixes	✅ Complete
10	Final Submission	⏳ Next


Overall Progress: 90%
🔐 Data & Security
- Supabase Authentication manages user accounts.
- Tasks are linked to individual user IDs.
- Supabase Row Level Security policies restrict access to user-specific data.
- Passwords are handled by Supabase Authentication.
- Completed tasks record completion and archive timestamps.
- Appearance preferences are stored locally in the user's browser.
Remaining Security Checks
- Review reauthentication for password changes.
- Verify Supabase redirect URLs.
- Verify Row Level Security policies.
- Ensure no secret service-role keys are exposed in frontend code.
🚀 Current Project Status
FocusCraft's planned core features have been implemented and manually tested.

The application currently supports authentication, task management, task organization, automatic archiving, background customization, and appearance preferences.

The project is entering its final submission and documentation stage.
🏁 Step 10 — Final Submission Checklist
- [ ] Create a final GitHub backup or release tag
- [ ] Confirm the latest GitHub Pages deployment works
- [ ] Review repository contents
- [ ] Complete final security checks
- [ ] Prepare final project description
- [ ] Prepare screenshots or demonstration materials if required
- [ ] Submit the website and repository links
💛 Project Goal
The goal of FocusCraft is to provide a simple, organized, customizable workspace that helps users stay focused, manage responsibilities, and track their productivity.

Current Status: 10/10 Steps Completed — Ready for Final Submission!
📝 Development Changelog — November 22, 2026
✅ Shipped: Persistent Task Image Attachments
- Added task image uploads using Supabase Storage's task-images bucket.
- Configured the bucket as private, with authenticated-user access policies for uploading, viewing, and deleting images in user-owned task folders.
- Organized image files under paths using the user's ID and task ID.
- Updated app.js to upload attached images, retrieve saved attachments, and generate signed URLs for displaying images from private storage.
- Confirmed that an attached image appears on a saved task card.
- Persistence test passed: the test image (“Little Sleepa”) remained visible after refreshing the local website.
- Pushed the updated application to GitHub.
- Production test passed: task images also remained visible after refreshing the live GitHub Pages website.
🛠️ Debugging and Fixes
- Fixed a JavaScript loading issue caused by the replacement file being named app2.js instead of app.js.
- Confirmed that sign-in and the Edit, Delete, and Archive controls worked again after restoring the correct filename.
- Investigated repeated local-page refreshes associated with the Live Server workflow; the user confirmed the issue was resolved.
📍 Current Verified Status
Task image attachments are deployed and confirmed to persist after page refresh on both local and live versions.

This does not yet confirm every possible image-management case (such as removing an individual attachment or handling multiple images on one task).
🎯 Next Development Tasks
1. Add or verify removal of individual task images, including deletion from Supabase Storage.
2. Add or verify support for multiple images attached to a single task.
3. Polish image thumbnails, previews, and task attachment controls.
4. Test attachment behavior when editing tasks, signing out and back in, and deleting tasks.
5. Keep the existing project documentation and changelog updated as each change is tested.
🔒 Project Rules Reminder
- Preserve the existing three application code files: index.html, app.js, and config.js.
- Make only requested code changes, and provide complete updated files.
- Never put secret credentials into the repository or documentation.
- Keep older changelog entries intact; append new progress entries.
📝 Development Changelog — November 28, 2026
✅ Build 3 — Social Features & Moderation
- Added shared tasks using unique invite codes. Owners can share tasks; members can join, view shared task details and leave. Shared tasks have a dedicated Social screen and do not count toward members' personal task statistics.
- Added task-specific conversations with usernames, timestamps and message reporting.
- Added a dedicated staff screen, accessible through the shield navigation icon for authorized staff.
- Added report review, message hiding and report dismissal.
- Added probation (social read-only access), temporary suspension and permanent social bans. Personal task management remains available.
- Moderators can review reports and issue probation or suspension. Admins can additionally issue permanent bans, remove punishments and promote or demote moderators by username.
- Added confirmation prompts and improved navigation and conversation layout.
🗄️ Database & Backend Changes
- Added or configured Shared_tasks, shared_task_members, shared_task_messages, message_reports and user_punishments; used existing profiles, admins and moderators tables.
- Added unique invite-code and membership indexes, Row Level Security policies and protected database functions for shared-task access, joining, reporting and moderation.
- Restricted invite-code visibility to task owners through the shared-task retrieval function; removed direct member access to the underlying shared-task rows.
- Added server-side role checks to moderation and moderator-management functions. Hiding staff buttons is not the security boundary.
- Updated the report-to-message foreign key to cascade on deletion, allowing shared tasks containing reported messages to be deleted. This also means deleting the underlying message removes its associated reports and evidence.
🌙 Dark Mode
- Added a sun/moon navigation toggle and dark styling across the dashboard, archive, social and moderation screens, security, appearance settings and task dialogs.
- Preserved custom accents, fonts and backgrounds.
- Stored light/dark preference in browser local storage; it persists across refreshes but does not synchronize across devices.
- Updated app.js and index.html; no additional Supabase tables required.
🧪 Testing & Results
- User confirmed shared-task joining, messaging, reporting, hiding and dismissal, probation, suspension, bans and punishment removal worked.
- User confirmed moderator promotion and all eight final functionality tests passed, including moderator restrictions in the interface, demotion, shield visibility, deletion of a disposable shared task containing a report, and existing personal-task features.
- User reported success after the final security-check instructions (regular-user calls to fc_get_reports and fc_set_moderator). Raw console results were not independently inspected.
- User reported the dark-mode update worked. Individual visual and persistence test results were not separately recorded.
- These are manual test reports, not a comprehensive automated test suite or formal security audit.
⚠️ Scope Decisions & Remaining Limitations
- Shared-task conversations replaced separate friend requests, direct messages and group chats by project decision. This may not satisfy every original Build 3 rubric requirement; the existing friend_requests table is unused.
- Account deletion and comprehensive storage-file cleanup are not implemented or verified. Deleting a task database row does not necessarily delete its uploaded files.
- The November 22 entry records the task-images bucket as private. Earlier testing also reported a public bucket; verify the current bucket setting and storage policies rather than assuming privacy from signed URLs alone.
- Verify nonmember access restrictions, direct invite-code access restrictions, all privileged RPC permissions, and remaining account-deletion foreign-key behavior before claiming comprehensive security.
- Earlier documentation is retained as historical progress; the status in this entry supersedes older progress estimates. Earlier security follow-ups remain open unless explicitly verified.
🏁 Current Status & Next Steps
Status: Agreed Build 3 functionality implemented and manually tested; final deployment and documentation wrap-up.
- [x] Shared tasks, messaging and reporting
- [x] Moderator and admin controls
- [x] Punishment system and moderator role management
- [x] User-reported final functionality and security smoke tests
- [x] Dark mode added and user-reported working
- [x] Append Build 3 changelog to project documentation
- [ ] Confirm latest Build 3 commit and push to GitHub (not yet explicitly confirmed)
- [ ] Verify latest GitHub Pages deployment
- [ ] Review outstanding privacy/security limitations and rubric differences
- [ ] Prepare summative study guide and practice tests
- [ ] Final submission