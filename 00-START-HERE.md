# DevFest 2026 — Codex Contest Kit

This folder is a **personal Markdown playbook** for the AI Vibe-Coding Contest. It contains checklists and blank planning/prompt templates only. It must not contain app source code, reusable project templates, components, CSS, contest solutions, or sample-data answers.

## Before carrying it to the contest

Ask an organizer whether prewritten AI instruction and checklist Markdown files are permitted. The rulebook allows code to be written during the contest, but does not explicitly discuss prewritten prompt/checklist files. If organizers say no, do not use these files during the contest. Keep this folder outside the new contest repository so it is not accidentally submitted.

## Read in this order

1. `01-RULES-CARD.md` — rule guardrails and hard deadlines.
2. `02-CODEX-INSTRUCTIONS.md` — instructions to give Codex at contest start.
3. `03-PROBLEM-INTAKE.md` — turn the revealed task into acceptance criteria.
4. `04-PROMPT-WORKFLOW.md` — generate and run small prompts from the real problem.
5. `05-TIMEBOX-AND-CUTS.md` — protect the must-have path and deployment time.
6. `06-COMMIT-LOG.md` — record every actual prompt and meet Git rules.
7. `07-TEST-CHECKLIST.md`, `08-DEPLOYMENT.md`, `09-README-CHECKLIST.md` — finish and publish.
8. `10-FINAL-SUBMISSION.md` — freeze at T+90 and submit.
9. `11-RECOVERY.md` — use only if something breaks.
10. `12-JUDGE-EXPLANATION.md` — prepare to explain your own app.
11. `13-CHATGPT-PROMPT-PLANNER.md` — a ready-to-paste ChatGPT prompt that creates the next Codex prompt, matching commit note, and test.

## Contest clock

The supplied rulebook says the contest date is 6 October 2026, 3:30–5:30 PM, with 90 minutes of build time and a five-minute submission-only late window. Its schedule says organizers will announce exact contest/results times separately. Confirm the actual start time and any rule changes with organizers. Use **T+0/T+90**, not wall-clock arithmetic, as your source of truth.

## Minimal operating loop

Understand the problem → ask questions by T+15 → have Codex produce a short plan and acceptance checklist → implement one coherent slice → inspect/run it → commit with the actual prompt note → repeat → deploy early → verify both languages and the live URL → final eligible push and form by T+90 → stop all changes.

## API budget note

First check how Codex is authenticated. ChatGPT sign-in usage and OpenAI API-key billing are separate. If using an API key, $14 is a finite API budget; check the current usage/cost view before and after a short trial. Prefer focused turns, reuse context instead of repeatedly pasting huge files, ask for concise outputs, avoid repeated full-repository reviews, and reserve budget for fixing/deploying. Do not paste your key into chat, a prompt, a repository, or the app.
