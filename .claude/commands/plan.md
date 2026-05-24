---
description: Kick the architect to plan a feature. Writes plan file to .claude/plans/.
argument-hint: <feature description>
---

You are about to invoke the `architect` agent to plan: **$ARGUMENTS**

Spawn the architect via Agent tool with `subagent_type: architect`. Pass the user's request verbatim.

The architect will:
1. Explore relevant code
2. Ask clarifying questions via AskUserQuestion
3. Write plan to `.claude/plans/<feature-slug>.md`
4. Summarize in 3 bullets and recommend the next agent

After it returns, surface the plan path + summary to the user. Wait for approval before dispatching implementer.
