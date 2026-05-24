---
description: Hand a plan to the implementer agent for execution.
argument-hint: <plan filename or feature description>
---

Spawn the `implementer` agent via Agent tool with `subagent_type: implementer`.

Pass it: **$ARGUMENTS** — either a plan filename in `.claude/plans/` or a short feature description.

The implementer will:
1. Read the plan + `.claude/CLAUDE.md` + `.claude/docs/conventions.md`
2. Convert plan phases to TaskCreate entries
3. Execute one phase at a time, verifying after each
4. Defer ambiguities back to user (or recommend re-spawning architect)

After it returns, verify: typecheck green, lint green, plan verification steps pass.
