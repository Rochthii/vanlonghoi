---
name: ui-responsive-layout
description: Layout rules to prevent text wrapping, image distortion, and element squeezing in responsive navigations and headers.
---
# Responsive Layout & Header Alignment Rules

This rule enforces constraints on flexboxes, grid tracks, and typography to avoid broken layout blocks on varied viewports.

## Rules
1. **Prevent Squeezing (Flex Shrink):** Critical brand elements (logos, active icons, call-to-actions) must have `flex-shrink: 0;` to prevent compression by neighboring layout blocks.
2. **Text Wrap Prevention:** Nav links, action pills, and status tags must use `white-space: nowrap;` and `display: inline-flex;` to prevent breaking labels into multiple lines on smaller viewports.
3. **Adaptive Breakpoints:** Hamburger menu toggles must trigger early (e.g., at `1024px` instead of `768px`) if the horizontal navigation items occupy more than 40% of the available width, preserving layout integrity.
