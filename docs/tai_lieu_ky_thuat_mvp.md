# DragonDoc AI — Tài Liệu Kỹ Thuật (MVP)

**Phiên bản:** 1.0 — Tháng 7/2026  
**Phạm vi:** Bản MVP tối giản, đủ để demo & bán cho 10 khách hàng đầu tiên — không phải kiến trúc enterprise cuối cùng.

---

## 1. Mục tiêu kỹ thuật

Xây một hệ thống hỏi-đáp (RAG) trên văn bản pháp luật Việt Nam, với 2 yêu cầu bắt buộc không được thỏa hiệp:

1. **Mọi câu trả lời phải kèm trích dẫn chính xác** (số Điều, Khoản, Điểm, tên văn bản).
2. **Không được bịa** — nếu không tìm thấy căn cứ trong kho dữ liệu, hệ thống phải trả lời "Không có căn cứ pháp lý trong tài liệu gốc", không tự suy diễn.

Mọi quyết định kỹ thuật bên dưới phục vụ 2 yêu cầu này trước, tốc độ phát triển thứ hai, chi phí hạ tầng thứ ba.

---

## 2. Phạm vi MVP (Out of scope tháng 1)

**Có ở MVP:**
- Upload văn bản luật (PDF) → xử lý → hỏi đáp có trích dẫn.
- Chatbot UI đơn giản, lịch sử hội thoại theo phiên.
- Tài khoản người dùng cơ bản (đăng ký/đăng nhập).

**KHÔNG có ở MVP (để lại vòng 2-3):**
- Knowledge Graph (Neo4j) — phát hiện văn bản hết hiệu lực/sửa đổi.
- Conformity Assessment Report tự động.
- RBAC phân quyền nhiều người dùng/phòng ban.
- On-premise / Air-gapped deployment.
- Local LLM (Llama 3) — dùng thẳng Claude API cho MVP.

→ Lý do: những phần này tốn công sức lớn nhưng không quyết định việc 10 khách hàng đầu có trả tiền hay không. Core value là "hỏi đúng, trích dẫn đúng".

---

## 3. Kiến trúc tổng quan (MVP)

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Next.js     │────▶│  API Route/      │────▶│  Claude API      │
│  Frontend    │     │  Backend (Node)  │     │  (Sonnet)        │
└─────────────┘     └──────────────────┘     └─────────────────┘
                            │      ▲
                            ▼      │
                    ┌──────────────────┐
                    │  Supabase         │
                    │  - Postgres       │
                    │  - pgvector       │
                    │  - Auth           │
                    │  - Storage (PDF)  │
                    └──────────────────┘
```

**Vì sao đơn giản hóa so với bản landing page ban đầu:**
- Bỏ Qdrant/Milvus riêng → dùng **pgvector trong Supabase** (1 database duy nhất, đủ nhanh cho <100k chunks, tiết kiệm chi phí vận hành và thời gian setup).
- Bỏ FastAPI riêng → dùng API Routes của Next.js (Node) hoặc Supabase Edge Functions, giảm 1 service phải deploy/maintain.
- Bỏ Celery → xử lý ingest đồng bộ hoặc dùng queue đơn giản (Supabase Cron / Vercel Background Functions) vì khối lượng văn bản tháng đầu nhỏ (~10-20 văn bản).
- Bỏ Cohere Rerank → dùng similarity search + rerank bằng chính Claude (đưa top-10 chunk vào prompt, để Claude chọn lọc) — đủ tốt ở quy mô nhỏ.

---

## 4. Chiến lược xử lý dữ liệu (quan trọng nhất)

### 4.1 Nguồn dữ liệu
- Lấy văn bản gốc từ nguồn chính thống: Cổng thông tin Chính phủ, LuatVietnam, ThuVienPhapLuat.
- Bắt đầu với ~10 văn bản: Luật AI 134/2025/QH15, Nghị định 142/2026, Nghị định 13/2023 (bảo vệ dữ liệu cá nhân), và 5-7 văn bản liên quan phổ biến nhất theo ICP đã chọn.

### 4.2 Chunking — KHÔNG chunk theo token/ký tự
Đây là điểm khác biệt cốt lõi so với RAG thông thường:

- **Chunk theo đơn vị pháp lý tự nhiên**: mỗi chunk = 1 Điều (hoặc 1 Khoản nếu Điều quá dài).
- Mỗi chunk lưu kèm metadata bắt buộc:
  ```json
  {
    "van_ban": "Luật Trí tuệ nhân tạo 2025",
    "so_hieu": "134/2025/QH15",
    "chuong": "Chương II",
    "dieu": "Điều 9",
    "khoan": "Khoản 1",
    "trang": 12,
    "hieu_luc_tu": "2026-03-01",
    "con_hieu_luc": true
  }
  ```
- Việc bóc tách Điều/Khoản từ PDF cần **parser tùy chỉnh theo regex** (nhận diện pattern "Điều X.", "Khoản Y." trong văn bản luật Việt Nam có cấu trúc khá nhất quán) — đây là phần cần đầu tư kỹ nhất.
  - **Hệ thống cảnh báo lỗi Parser:** Parser phải được lập trình để phát hiện và cảnh báo các điểm bất thường như mất tính liên tục của số thứ tự (ví dụ: phát hiện Điều 3 rồi nhảy sang Điều 5 mà không thấy Điều 4).
- Sau khi parse tự động, **cần nạp vào màn hình duyệt Admin UI**: Admin/Editor kiểm tra trực quan cấu trúc đã bóc tách, chỉnh sửa thủ công nếu có lỗi định dạng PDF, và bấm "Approve" duyệt trước khi nạp vector vào Database. Bắt buộc review 100% của 10 văn bản đầu tiên trước khi đưa vào production — sai 1 Điều ở đây có thể gây hậu quả pháp lý nghiêm trọng cho khách hàng.

### 4.3 Embedding & lưu trữ
- Dùng embedding model của Voyage AI hoặc OpenAI text-embedding-3 (Claude API hiện chưa có embedding riêng — cần chọn 1 nhà cung cấp embedding ngoài).
- Lưu vector trong bảng `chunks` của Supabase (pgvector), kèm toàn bộ metadata ở trên trong cùng row (tránh phải join nhiều bảng).

### 4.4 Truy vấn (Retrieval)
Pipeline mỗi câu hỏi:
1. Embed câu hỏi người dùng.
2. Similarity search lấy top 5-8 chunks liên quan nhất (pgvector cosine distance) — giới hạn thấp thay vì 15-20 chunks để kiểm soát chi phí token đầu vào.
3. Lọc bỏ chunks có `con_hieu_luc: false` trừ khi người dùng hỏi về lịch sử.
4. Đưa các chunks còn lại (kèm đầy đủ metadata) vào context của Claude.

### 4.5 Phương án Thay thế tối ưu cho MVP: Không dùng Retrieval (Full-Text Prompt Caching)
* **Bối cảnh:** Quy mô ban đầu của hệ thống chỉ có ~10 văn bản luật (~150k - 200k tokens).
* **Giải pháp:** Thay vì xây dựng hệ thống embedding và similarity search phức tạp ngay từ đầu, nạp **toàn bộ văn bản** trực tiếp vào system context và kích hoạt tính năng **Prompt Caching** của Claude Sonnet.
* **Lợi ích:**
  * Bỏ qua hoàn toàn việc code embedding pipeline, setup pgvector ở tuần 1-2.
  * Claude đọc hiểu được toàn văn bản gốc cùng lúc, loại bỏ 100% rủi ro do thuật toán retrieval tìm thiếu hoặc lệch thông tin.
  * Chi phí cache-read của Claude Sonnet cực rẻ ($0.30/triệu tokens), rẻ hơn nhiều so với việc gọi embeddings và truy vấn liên tục.
  * Chỉ khi kho văn bản tăng lên (vượt quá giới hạn context window 200k tokens), ta mới chuyển sang cơ chế RAG lai ở Giai đoạn 2.

### 4.6 System prompt bắt buộc (chống ảo giác)
Nguyên tắc cứng cho system prompt:
- Chỉ được trả lời dựa trên các đoạn văn bản được cung cấp trong context.
- Mọi khẳng định pháp lý phải đi kèm chú thích (Văn bản – Điều – Khoản).
- Nếu không có đoạn nào trong context trả lời được câu hỏi, phải trả lời rõ "Không tìm thấy căn cứ pháp lý trong tài liệu hiện có" — tuyệt đối không tự suy luận thêm.
- Không được diễn giải mở rộng vượt quá nội dung câu chữ của điều luật.

---

## 5. Data model (rút gọn)

| Bảng | Trường chính | Ghi chú |
|---|---|---|
| `documents` | id, ten_van_ban, so_hieu, ngay_ban_hanh, hieu_luc_tu, con_hieu_luc, file_url | 1 row / văn bản luật |
| `chunks` | id, document_id, dieu, khoan, diem, trang, noi_dung, embedding (vector), **replaced_by_chunk_id** | 1 row / đơn vị Điều-Khoản. Cột `replaced_by_chunk_id` liên kết thủ công tới Điều/Khoản mới thay thế (đóng vai trò là Sơ đồ liên kết/Knowledge Graph rút gọn cho MVP) |
| `users` | id, email, ho_ten, plan, stripe_customer_id | Quản lý bởi Supabase Auth |
| `conversations` | id, user_id, created_at | 1 row / phiên chat |
| `messages` | id, conversation_id, role, content, citations (jsonb) | Lưu cả câu trả lời + trích dẫn đã dùng, để audit sau này |

---

## 6. Stack công nghệ đề xuất (MVP)

| Lớp | Công nghệ | Lý do chọn |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind | Nhanh, quen thuộc, dễ dùng Claude Code/v0 scaffold |
| Backend | Next.js API Routes / Supabase Edge Functions | Giảm số service phải vận hành riêng |
| Database + Vector | Supabase (Postgres + pgvector) | 1 nền tảng lo cả DB, Auth, Storage — giảm độ phức tạp DevOps |
| Auth | Supabase Auth | Có sẵn, không cần build riêng |
| LLM | Claude API (Sonnet) | Chất lượng lập luận pháp lý tốt, dễ tuning qua system prompt |
| Embedding | Voyage AI hoặc OpenAI embedding | Cần 1 nhà cung cấp embedding riêng |
| Thanh toán | Stripe hoặc cổng nội địa (VNPay/MoMo) tùy khách hàng | Với khách hàng Founding Member tháng đầu có thể thu tay qua chuyển khoản để đơn giản hóa |
| Hosting | Vercel (frontend + API) | Deploy nhanh, phù hợp giai đoạn MVP |

---

## 7. Bảo mật (mức tối thiểu chấp nhận được cho MVP)

Dù chưa cần Air-Gapped Vault ngay, vẫn phải có từ ngày đầu:
- Mã hóa dữ liệu tại rest (Supabase mặc định có) và in-transit (HTTPS/TLS).
- Không gửi dữ liệu khách hàng (hợp đồng riêng nếu họ upload) sang bên thứ 3 để train mô hình — nói rõ với khách và tuân thủ thật.
- Row-level security (RLS) trong Supabase: mỗi user chỉ truy vấn được dữ liệu/tài liệu của chính mình.
- Log lại mọi câu trả lời + trích dẫn đã dùng (bảng `messages.citations`) để có thể truy vết nếu khách hàng khiếu nại về độ chính xác.

---

## 8. Kế hoạch build theo tuần (khớp với kế hoạch bán hàng 30 ngày)

| Tuần | Việc kỹ thuật |
|---|---|
| Tuần 1 | Setup Supabase + Next.js skeleton. Viết parser Điều/Khoản, xử lý thủ công 10 văn bản đầu, review 100%. |
| Tuần 2 | Build pipeline embedding + retrieval + system prompt. Test 30-50 câu hỏi thật, đo tỷ lệ trích dẫn đúng. |
| Tuần 3 | Hoàn thiện UI chat, thêm auth + lưu lịch sử hội thoại. Dùng để demo trực tiếp cho khách. |
| Tuần 4 | Sửa lỗi theo feedback khách Founding Member, thêm logging/audit trail. |

---

## 9. Chỉ số kỹ thuật cần đo (đừng chỉ đo "chạy được")

- **Tỷ lệ trích dẫn chính xác**: lấy mẫu 50 câu hỏi, cho người có chuyên môn luật chấm điểm đúng/sai — mục tiêu >90% trước khi thu tiền thật.
- **Tỷ lệ "từ chối đúng lúc"**: khi câu hỏi không có căn cứ trong kho dữ liệu, hệ thống có từ chối thay vì bịa không.
- **Độ trễ trả lời**: mục tiêu <5 giây/câu hỏi ở MVP (không cần đạt 0.3s như trang landing page quảng cáo — đó là con số marketing, không phải cam kết kỹ thuật thật ở giai đoạn này).

---

## 10. Rủi ro kỹ thuật cần lường trước

- **Parser Điều/Khoản lỗi ở văn bản có cấu trúc không chuẩn** (văn bản cũ scan ảnh, format khác nhau giữa các loại văn bản) → cần fallback: đánh dấu "cần review thủ công" và hiển thị rõ trên Admin UI trước khi cho phép Approve nạp vào database.
- **Văn bản hết hiệu lực nhưng chưa cập nhật `con_hieu_luc: false`** → quy trình vận hành: mỗi tuần kiểm tra thủ công các văn bản mới/sửa đổi liên quan, chưa tự động hóa ở MVP.
- **Chi phí Claude API làm lỗ nặng gói Starter**: 
  * *Rủi ro:* Nếu 1 user dùng hết 1.000 queries/tháng, với chi phí 450đ–750đ/query (do nhồi 15-20 chunks context), tổng chi phí API sẽ là 450.000đ - 750.000đ. Con số này vượt xa doanh thu gói Starter (290.000đ/tháng), gây lỗ ngay từ tháng đầu tiên.
  * *Khắc phục:* 
    1. Giảm hạn mức của gói **Legal Starter** xuống còn **250 queries/tháng**.
    2. Giới hạn số lượng context truyền vào LLM xuống chỉ còn **top 5-8 chunks liên quan nhất** thay vì 15-20 chunks.
    3. Bắt buộc triển khai **Prompt Caching** ngay ở bản MVP để đưa chi phí trung bình mỗi query xuống dưới 150đ.
    4. Cân nhắc cấu hình phương án nạp toàn bộ corpus vào Prompt Cache thay vì RAG để tối ưu chi phí và nâng cao độ chính xác ở quy mô nhỏ.
