// =========================================================
// DRAGONDOC AI — Interactive Demo Simulation
// Simulates the real AI Knowledge Guardian experience
// =========================================================

class DragonDocDemo {
  constructor() {
    this.currentDoc = 0;
    this.isTyping = false;

    // Clean SVG icons for documents
    const docSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

    this.docs = [
      { icon: docSvg, name: 'Luật AI 134_2025_QH15.pdf', type: 'pdf', color: '#00E5FF' },
      { icon: docSvg, name: 'Nghị định 142_2026_ND-CP.pdf', type: 'pdf', color: '#60A5FA' },
      { icon: docSvg, name: 'Nghị định 13_2023_Bảo vệ DLCN.pdf', type: 'pdf', color: '#34D399' },
      { icon: docSvg, name: 'Quy chế Compliance Nội bộ.docx', type: 'docx', color: '#A78BFA' },
    ];

    this.conversations = [
      {
        docIndex: 0,
        exchanges: [
          {
            user: 'Hệ thống AI phân loại tín dụng của ngân hàng có thuộc nhóm rủi ro cao không?',
            ai: 'Có. Theo **Điều 14, Khoản 2, Điểm b** của Luật AI 134/2025/QH15, các hệ thống AI tự động phân loại, chấm điểm tín dụng hoặc đánh giá khả năng tài chính cá nhân được xếp vào **Nhóm AI Rủi ro cao**. Doanh nghiệp bắt buộc phải thực hiện **Đánh giá tuân thủ (Conformity Assessment)** trước khi vận hành.',
            citation: 'Luật AI 134_2025_QH15.pdf — Điều 14, Khoản 2, tr.18',
          },
          {
            user: 'Thời hạn bắt buộc phải báo cáo sự cố AI rủi ro cao cho cơ quan quản lý là bao lâu?',
            ai: 'Theo **Điều 22, Khoản 1**, trong trường hợp phát sinh sự cố nghiêm trọng gây ảnh hưởng dữ liệu hoặc vi phạm quyền riêng tư, Bên vận hành (Deployer) phải gửi thông báo bằng văn bản cho Bộ Thông tin & Truyền thông trong vòng **72 giờ** kể từ khi phát hiện.',
            citation: 'Luật AI 134_2025_QH15.pdf — Điều 22, Khoản 1, tr.31',
          },
        ],
      },
      {
        docIndex: 1,
        exchanges: [
          {
            user: 'Nghị định 142/2026 quy định thời gian ân hạn tuân thủ cho ngành Ngân hàng là bao lâu?',
            ai: 'Theo **Điều 34, Khoản 2** của Nghị định 142/2026/NĐ-CP, các tổ chức tài chính - ngân hàng đang triển khai AI rủi ro cao được hưởng thời gian ân hạn chuyển tiếp là **18 tháng** kể từ ngày 01/03/2026 (hạn chót hoàn tất hồ sơ tuân thủ là tháng 09/2027).',
            citation: 'Nghị định 142_2026_ND-CP.pdf — Điều 34, tr.45',
          },
        ],
      },
      {
        docIndex: 2,
        exchanges: [
          {
            user: 'Doanh nghiệp xử lý dữ liệu cá nhân nhạy cảm cần chuẩn bị hồ sơ gì?',
            ai: 'Theo **Điều 12 & 13** Nghị định 13/2023/NĐ-CP, doanh nghiệp phải lập và lưu giữ **Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA)** và gửi 01 bản chính về Cục An ninh mạng (A05) trong thời hạn **60 ngày** kể từ ngày tiến hành xử lý.',
            citation: 'Nghị định 13_2023_Bảo vệ DLCN.pdf — Điều 12, tr.14',
          },
        ],
      },
    ];

    this.init();
  }

  init() {
    this.renderDocList();
    this.startAutoDemo();
  }

  renderDocList() {
    const sidebar = document.getElementById('demo-doc-list');
    if (!sidebar) return;

    sidebar.innerHTML = this.docs.map((doc, i) => `
      <div class="demo-doc-item ${i === this.currentDoc ? 'active' : ''}" data-idx="${i}" onclick="dragonDemo.switchDoc(${i})">
        <div class="demo-doc-icon" style="background:${doc.color}15;border:1px solid ${doc.color}30;color:${doc.color}">${doc.icon}</div>
        <div style="min-width:0">
          <div style="font-size:0.75rem;color:var(--text-primary);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${doc.name}</div>
          <div style="font-size:0.65rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em">${doc.type}</div>
        </div>
      </div>
    `).join('');
  }

  switchDoc(idx) {
    this.currentDoc = idx;
    this.renderDocList();
    const convIdx = this.conversations.findIndex(c => c.docIndex === idx);
    if (convIdx !== -1) {
      this.clearChat();
      this.playExchanges(this.conversations[convIdx].exchanges, 0);
    }
  }

  clearChat() {
    const chat = document.getElementById('demo-chat-messages');
    if (chat) chat.innerHTML = '';
  }

  async playExchanges(exchanges, idx) {
    if (idx >= exchanges.length || this.isTyping) return;
    this.isTyping = true;
    const exchange = exchanges[idx];

    await this.delay(600);
    this.appendUserMessage(exchange.user);

    await this.delay(1200);
    await this.appendAiMessage(exchange.ai, exchange.citation);

    this.isTyping = false;

    if (idx + 1 < exchanges.length) {
      await this.delay(3000);
      this.playExchanges(exchanges, idx + 1);
    }
  }

  appendUserMessage(text) {
    const chat = document.getElementById('demo-chat-messages');
    if (!chat) return;

    const userSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    const msg = document.createElement('div');
    msg.className = 'chat-message chat-message--user';
    msg.innerHTML = `
      <div class="chat-avatar chat-avatar--user">${userSvg}</div>
      <div class="chat-bubble chat-bubble--user">${text}</div>
    `;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  async appendAiMessage(text, citation) {
    const chat = document.getElementById('demo-chat-messages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = 'chat-message';

    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>');

    msg.innerHTML = `
      <div class="chat-avatar chat-avatar--ai">
        <img src="assets/logo.png" alt="DragonDoc AI" class="chat-avatar-img">
      </div>
      <div class="chat-bubble chat-bubble--ai">
        <span id="typing-${Date.now()}"></span>
        <span class="typing-cursor"></span>
      </div>
    `;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;

    const typingEl = msg.querySelector('[id^="typing-"]');
    const cursor = msg.querySelector('.typing-cursor');

    // Type out the response character by character
    const rawText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    let displayed = '';
    for (let i = 0; i < rawText.length; i++) {
      displayed += rawText[i];
      typingEl.innerHTML = displayed.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>');
      chat.scrollTop = chat.scrollHeight;
      await this.delay(18 + Math.random() * 12);
    }

    // Replace with formatted text
    typingEl.innerHTML = formattedText;
    cursor.remove();

    // Add citation with clean SVG icon
    if (citation) {
      const docSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;vertical-align:-1px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
      const citEl = document.createElement('div');
      citEl.innerHTML = `
        <div class="chat-citation" style="margin-top:8px">
          ${docSvg} ${citation}
        </div>
      `;
      msg.querySelector('.chat-bubble').appendChild(citEl);
    }

    chat.scrollTop = chat.scrollHeight;
  }

  startAutoDemo() {
    setTimeout(() => {
      const conv = this.conversations[0];
      this.playExchanges(conv.exchanges, 0);
    }, 1500);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize
let dragonDemo;
document.addEventListener('DOMContentLoaded', () => {
  dragonDemo = new DragonDocDemo();
});
