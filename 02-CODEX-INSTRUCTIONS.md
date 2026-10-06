# Codex Instructions for Contest Day

At T+0, give Codex this file and the released problem statement. Then ask it to read the task carefully and prepare a compact plan before editing files.

## Working agreement

You are helping me build a solution for the DevFest 2026 AI Vibe-Coding Contest. Follow the contest rulebook and organizer clarifications. The user is the competitor and is responsible for understanding and explaining all submitted code.

1. First extract explicit requirements into: must-have, optional bonus, assumptions, and questions. Do not invent features to fill ambiguity. I can ask organizers only during T+0–T+15; flag questions immediately.
2. Before coding, return a concise implementation plan, acceptance checklist, risk list, and order in which features will be cut if time runs short. Keep the main user journey first.
3. After I approve, implement the smallest complete browser-only app that satisfies the required tasks. Use only code created during this contest, standard browser capabilities, permitted official starter tools, and allowed open-source libraries.
4. Do not add participant-controlled backend/server/serverless functions, database, Firebase/Supabase/Appwrite persistence, remote file storage, or other persistent online storage. Browser storage is allowed. External HTTPS browser APIs are optional; build a useful fallback so core features survive API failure.
5. Every main user-facing label, button, instruction, validation message, status, empty state, and error must be available in Bangla and English. Include an obvious language switch and verify both modes.
6. Never put credentials, tokens, or API keys in source, prompts that may be committed, repository history, or the deployed site. Do not add an in-app AI feature unless it is optional and the user enters their own key at runtime; all core behavior must work without it.
7. Work in small, coherent slices. After each slice, summarize changed behavior, files, a quick manual check, known issue, and a short truthful commit note containing the actual prompt I used. Do not commit or push unless I ask, except that contest rules require timely commits and pushes and I may explicitly authorize these actions.
8. Keep responses compact and time-aware. Do not rewrite the whole app for a small bug. Inspect relevant files before editing. Prefer the simplest solution that works and is easy for me to explain.
9. Track remaining time using the T+ elapsed time I provide. Protect deployment and final submission time. Warn me when a requested feature threatens the required path or T+90 deadline.
10. By T+90, stop all code, Git, push, and deployment changes. Help me verify the final commit/deployment and complete the form before the deadline.

## At task start

Ask Codex:

> Read this instruction file and the full problem statement. Do not edit files yet. Return (1) a one-sentence problem summary, (2) must-have acceptance criteria, (3) bonus criteria, (4) questions to ask organizers before T+15, (5) a short implementation sequence with time estimates, and (6) deployment risks. Identify any rule conflict. Be concise.

Only after I review that response should implementation start.
