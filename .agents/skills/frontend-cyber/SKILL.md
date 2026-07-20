---
name: frontend-cyber-style
description: Kỹ năng xây dựng giao diện Cyber-AI SaaS cao cấp, sử dụng CSS Grid, hiệu ứng viền sáng (glow line), và biểu tượng vector SVG thay thế cho emoji.
---
# Kỹ năng Phát triển Giao diện Cyber-AI SaaS Cao Cấp

Kỹ năng này giúp tác nhân AI xây dựng giao diện chất lượng cao cho các dự án trong hệ sinh thái Vân Long Hội, dựa trên các quy tắc tối ưu hóa thiết kế mở rộng.

## 1. Thiết lập CSS Variables (design-system.css)
Mọi màu sắc và hiệu ứng ánh sáng phải tuân thủ hệ thống biến tùy chỉnh:
*   `--clr-void`: Nền không gian tối nhất (`#060810`).
*   `--clr-obsidian`: Nền chính (`#0B0F1A`).
*   `--clr-dragon-cyan`: Màu nhấn tia chớp (`#00E5FF`).
*   `--glow-cyan-sm`: Hiệu ứng viền sáng mờ (`0 0 8px rgba(0, 229, 255, 0.4)`).

## 2. Tiêu chuẩn Biểu tượng Vector SVG thay thế Emoji
Tuyệt đối không dùng biểu tượng emoji trực tiếp trên UI. Hãy sử dụng cấu trúc SVG inline nhẹ, tối giản:

*   **Tài liệu (Document Icon):**
    ```html
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    ```
*   **Bảo mật (Shield/Security Icon):**
    ```html
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ```

## 3. Chống vỡ khung chữ (Text Wrap prevention)
Đối với danh sách điều hướng ngang (Navbar) hoặc bảng giá (Pricing Card header), bắt buộc sử dụng CSS:
```css
.nav-links li {
  white-space: nowrap;
}
.nav-links a {
  white-space: nowrap;
}
```
Và nâng ngưỡng kích hoạt menu hamburger lên `1024px` để tránh đè chữ trên màn hình nhỏ.
