---
name: tiptap-extension
description: Add a custom Tiptap extension (Node, Mark, or Extension) plus matching renderer block. Wires into RichTextEditor toolbar + RichTextRenderer. Trigger when user wants a new content block (callout, embed, gallery, video) in the editor.
---

# Tiptap Extension Skill

## When to trigger

- "add <X> block to editor" (e.g. callout, image gallery, video embed, code block)
- "new Tiptap extension"

## Where

- Extension: `packages/ui/src/editor/extensions/<name>.ts`
- React node view (if interactive): `packages/ui/src/editor/extensions/<name>NodeView.tsx`
- Toolbar button: `packages/ui/src/editor/toolbar/<Name>Button.tsx`
- Renderer node: `packages/ui/src/editor/renderer/<Name>Node.tsx` (used by `RichTextRenderer`)

## Pattern

```ts
// extensions/<name>.ts
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { <Name>NodeView } from "./<name>NodeView"

export const <Name> = Node.create({
  name: "<name>",
  group: "block",
  atom: false,
  addAttributes() {
    return {
      // attributes with default + parseHTML + renderHTML
    }
  },
  parseHTML() { return [{ tag: 'div[data-type="<name>"]' }] },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "<name>" }), 0]
  },
  addNodeView() { return ReactNodeViewRenderer(<Name>NodeView) },
})
```

## Register

In `packages/ui/src/editor/RichTextEditor.tsx` extensions array:

```ts
import { <Name> } from "./extensions/<name>"
// ...
extensions: [StarterKit, <Name>, /* ...others */]
```

## Renderer

In `packages/ui/src/editor/RichTextRenderer.tsx`, add a case for the node type so static rendering (client + server) works without the editor instance.

## Toolbar

Add `<<Name>Button>` to the toolbar variants. Use `editor.chain().focus().insert<Name>().run()`.

## Rules

- Attributes typed via `declare module "@tiptap/core" { interface Commands { ... } }` for command type-safety
- Node view styled with brand tokens (no raw hex)
- Renderer must match node view visually
- Document attributes in the file header comment

## Verification

- Create blog post via admin → insert block → save
- Render on user `/blog/[slug]` matches editor preview
