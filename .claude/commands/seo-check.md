---
description: Run the seo-auditor on a specific route.
argument-hint: <route-path>
---

Spawn `seo-auditor` agent.

Route: **$ARGUMENTS**

Auditor will:
1. Read the route file + layout chain
2. Verify against `.claude/docs/seo-checklist.md`
3. Output markdown report: PASS/FAIL + findings

Read-only. No edits.
