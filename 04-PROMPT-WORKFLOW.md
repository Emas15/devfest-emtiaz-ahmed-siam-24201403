# Prompt Workflow: Problem → Small, Useful Codex Tasks

You do not need to invent impressive prompts. Give Codex the real statement, ask it to structure the work, then use one precise prompt per feature/fix. Keep each task narrow enough to review and describe in a commit.

## Step 1: Ask for analysis, not code

Use the task-start prompt in `02-CODEX-INSTRUCTIONS.md`. Compare its must-have list against the problem sheet. Correct it before coding. Resolve important ambiguities with organizers before T+15.

## Step 2: Ask Codex to propose a first slice

> Based only on the approved acceptance checklist, propose the smallest complete first implementation slice. State the user flow, files you expect to create, and how I can verify it manually. Keep all work browser-only, bilingual, and within the contest rules. Do not implement yet.

Then choose the first required flow, not a bonus or elaborate visual polish.

## Step 3: Generate one task prompt at a time

> Turn requirement `[R# / quote]` into one implementation prompt that I can paste into Codex. Limit it to one coherent change and make the prompt short enough to quote in a Git commit body (aim under 160 characters). Include the visible behavior, Bangla and English requirement, relevant constraints, and a simple acceptance check. Do not add requirements that are not in the problem.

Paste/use the returned prompt. Copy the **actual prompt you use** into `06-COMMIT-LOG.md`; do not claim to have used a different prompt later.

## Step 4: Build, inspect, correct

After each change:

> Summarize exactly what changed and how to verify it manually. Compare it against acceptance criteria `[R#]`. Point out any requirement still incomplete. Keep the summary short; do not make another change yet.

If it is wrong, write a focused fix prompt:

> Fix only this observed issue: `[actual issue and reproduction steps]`. Preserve existing working behavior. Keep Bangla and English in sync. Do not add unrelated features. Tell me the manual check after the fix.

## Step 5: Ask for a bounded review

> Review the current app only against these acceptance criteria: `[paste the short must-have list]`. Report only concrete failures, with reproduction steps and severity. Do not refactor or edit files. Check frontend-only compliance, secrets, both languages, and the primary user flow.

Use one bounded review near the end. Avoid repeatedly asking for a whole-repo review; it consumes time and can create low-value churn.

## Prompt habits that save time and API budget

- Include the exact requirement and only the relevant context. Do not paste the entire conversation or every file when unnecessary.
- Request a concise response and one action at a time. Avoid open-ended “make it amazing” instructions.
- Ask Codex to inspect relevant files before changing them and preserve working behavior.
- Prefer repair of a reproduced problem to broad rewrites.
- Do not ask the model to generate dozens of future prompts before seeing results; the implementation and actual blockers will change.
- Use a model/reasoning level that is strong enough for the task and available to your Codex login. Do not assume your API balance pays for ChatGPT-authenticated Codex.
