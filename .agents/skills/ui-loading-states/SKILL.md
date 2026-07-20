---
name: ui-loading-states
description: Styling and DOM rules for displaying loading skeletons and streaming text cursors in AI widgets.
---
# AI Streaming Loading Indicator Rules

This rule defines how loading and streaming animations are styled and handled in the DOM.

## Rules
1. **Initial Skeleton State:** Show a pulsing skeleton loader (e.g., using CSS `.shimmer-effect`) immediately when a query is submitted and the backend is processing the RAG database.
2. **Streaming Cursor Effect:** Once the first text chunk arrives, swap the skeleton for the active text node followed by a glowing vertical typing cursor indicator (e.g., `span.typing-cursor` with blink animation).
3. **Graceful Completion:** Immediately remove the typing cursor DOM element once the text generation completes, ensuring clean clipboard copy actions and clean static layouts.
