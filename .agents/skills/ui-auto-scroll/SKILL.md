---
name: ui-auto-scroll
description: Auto-scroll guidelines for message list containers in AI chat interfaces.
---
# Chat Interface Auto-Scroll Rule

This rule ensures a smooth user experience in the chat container by keeping the newest messages in view during streaming.

## Rules
1. **Container Tracking:** The chat scrollable container must automatically scroll to the bottom (`scrollTop = scrollHeight`) whenever:
   - A new message bubble is appended to the DOM.
   - Every single character chunk is appended during streaming typing animations.
2. **User Interruption Check:** If the user has manually scrolled up to read older history (e.g., `scrollTop + clientHeight < scrollHeight - 50`), disable auto-scroll temporarily to prevent disrupting the user's reading flow.
3. **Smooth Scroll Behavior:** Use `behavior: 'smooth'` for initial scroll transitions, and direct pixel assignments for character-by-character typing animations to avoid frame stuttering.
