# VÂN LONG HỘI (雲龍會) — Project-scoped Agent Rules
## DRAGONDOC AI — COMPLIANCE GUARDIAN (AI Legal & Compliance Intelligence)

These rules configure the **Antigravity IDE** agent behavior for this workspace, specifically tailored for the **DragonDoc AI — Compliance Guardian** product pivot.

---

## 1. STRATEGIC PIVOT & FOCUS
*   **Single Target Niche:** AI Compliance & Legal Intelligence for Vietnam and Southeast Asia.
*   **Core Regulations Focus:** **Luật AI 134/2025/QH15** (hiệu lực 01/03/2026), **Nghị định 142/2026/NĐ-CP** (Danh mục 46 hệ thống AI rủi ro cao), **Nghị định 13/2023/NĐ-CP** (Bảo vệ dữ liệu cá nhân).
*   **Target Personas:** Công ty Luật & Hãng tư vấn, In-house Legal Doanh nghiệp, và Startup & AI Deployer vận hành hệ thống AI rủi ro cao.

---

## 2. PRODUCT & ARCHITECTURE GUARDRAILS
*   **Strict Grounding (Không ảo giác):** RAG responses must ONLY be generated from trusted regulatory or enterprise-uploaded texts. When a query is answered, it MUST cite specific **Điều, Khoản, Điểm** and page numbers. If no source is found, output "Không có căn cứ pháp lý trong tài liệu gốc" (no hallucinated assumptions).
*   **Data Sovereignty (Bảo mật tuyệt đối):** The platform operates under strict **Zero-Data-Training** guarantees. No customer data/contracts may be sent to public training pipelines. Code must support air-gapped deployment options (local LLMs like Llama 3 + private MinIO vault).
*   **Knowledge Graph (Sơ đồ liên kết):** Model statutory relationships (e.g. amending, replacing, supplementing laws) and internal policies. Alert users of active vs. expired laws.

---

## 3. VIBE CODING & SYSTEM STABILITIES
*   **Context Verification First:** Before modifying any file, read its full content. Do not write code based on assumptions.
*   **No Mock / No Demo Logic:** All components, APIs, and workflows must represent real production-grade implementation.
*   **Vanilla CSS Design System:** Use CSS variables defined in `css/design-system.css`. Maintain the obsidian deep space theme (`#060810`, `#0B0F1A`) with electric cyan (`#00E5FF`) and glowing indigo. No raw emojis in the UI; use clean inline SVGs.
*   **No cd commands:** Avoid proposing `cd` commands. Set correct paths and run directly.
