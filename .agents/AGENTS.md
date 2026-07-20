# VÂN LONG HỘI (雲龍會) — Project-scoped Agent Rules

These rules configure the **Antigravity IDE** agent behavior for this workspace. They are adapted from open-source community standards (such as `awesome-cursorrules` and `vibe-coding` guardrails) to guarantee stable, production-grade output.

---

## 1. VIBE CODING PROTOCOLS (Guardrails)
*   **Context Verification First:** Before modifying any file or proposing a solution, ALWAYS read the full content of the target file and its imports. NEVER write code based on assumptions.
*   **Grounded Hypotheses:** Only execute commands or build targets when you have a specific technical hypothesis to verify. Do not run commands randomly to "see if it works".
*   **Verification Loop:** After editing any file, verify syntax correctness. If a local server is running, check compatibility.

---

## 2. FRONTEND & VISUAL QUALITY STANDARDS (Cyber-AI SaaS)
*   **Vanilla CSS Tokens:** Keep styles modular. Use CSS custom properties defined in `css/design-system.css` for color schemes, spacing, typography, and glow effects.
*   **No Raw Emojis in UI:** Emojis are prohibited in the production UI layout. Always use high-quality, lightweight inline SVG icons.
*   **Obsidian Theme Aesthetic:** Adhere to the deep space obsidian theme (`#060810`, `#0B0F1A`) accented by electric cyan (`#00E5FF`) and glowing indigo.
*   **Responsiveness & Layout:** Always use CSS Grid or Flexbox with `flex-shrink` and `white-space: nowrap` for horizontal lists to prevent text wrapping on smaller viewports.

---

## 3. PRODUCTION INTEGRITY (No Mock / No Fake)
*   **Strict Grounding:** No placeholder text, fake values, or simulated backend success statuses.
*   **Real Data Flows:** Every component must interact with real DOM events, real local storage state, or real API endpoints.
*   **Zero-Data Leak Guarantees:** Ensure all client-side logic avoids caching sensitive user content or transmitting data to unauthorized external endpoints.
