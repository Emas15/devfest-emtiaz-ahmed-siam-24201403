# Git and Commit Log

Contest rules require a new public repository named `devfest-<registration-number>`, no project code before T+0, a commit at least every 30 minutes, at least three commits total, and a short change note plus the actual prompt used in every commit message. Manual changes must say `Manual edit`. Never rewrite pushed history.

## Commit rhythm

- Commit and push a coherent milestone at roughly T+25, T+50, and T+75, then the final eligible commit by T+90. Do not wait until the deadline to discover push/auth problems.
- Each commit should represent work you can explain and that does not knowingly break the app.
- Keep the prompt note short and truthful. Make prompts deliberately concise so they fit.
- Include the actual prompt in the commit body, or a concise exact prompt excerpt if organizer guidance interprets “short note” that way. Do not fabricate or paraphrase it as a prompt you did not use.

## Suggested message pattern

```text
feat: complete [specific user-visible change]

Prompt used: "[the concise prompt actually used]"
```

For a manual edit:

```text
fix: correct [specific issue]

Prompt used: Manual edit
```

## Live log

| Target time | Commit ID | Change | Exact prompt used / Manual edit | Pushed? | Live deploy verified? |
|---|---|---|---|---|---|
| T+25 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| T+50 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| T+75 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |
| Final ≤T+90 | `[ ]` | `[ ]` | `[ ]` | `[ ]` | `[ ]` |

## Final commit record

- Full final eligible commit ID: `[ ]`
- Repository URL: `[ ]`
- Matching public HTTPS URL: `[ ]`
- Commit pushed before T+90: `[ ]`
- Deployment corresponds to this commit: `[ ]`
