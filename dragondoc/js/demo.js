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
      { icon: docSvg, name: 'Quy chế học vụ.pdf', type: 'pdf', color: '#00E5FF' },
      { icon: docSvg, name: 'Đề cương môn học.docx', type: 'docx', color: '#60A5FA' },
      { icon: docSvg, name: 'Sổ tay sinh viên.pdf', type: 'pdf', color: '#34D399' },
      { icon: docSvg, name: 'Kế hoạch đào tạo.pptx', type: 'pptx', color: '#A78BFA' },
    ];

    this.conversations = [
      {
        docIndex: 0,
        exchanges: [
          {
            user: 'Sinh viên có được phép thi lại không nếu điểm dưới 5?',
            ai: 'Có. Theo **Điều 12, Khoản 3** của Quy chế học vụ, sinh viên có điểm tổng kết học phần dưới 5.0 được quyền đăng ký thi lại trong kỳ thi phụ. Tuy nhiên, điểm thi lại tối đa được ghi nhận là **8.5/10**.',
            citation: 'Quy chế học vụ.pdf — Điều 12, tr.24',
          },
          {
            user: 'Điều kiện để được xét học bổng loại xuất sắc?',
            ai: 'Để được xét học bổng loại **Xuất sắc**, sinh viên cần: (1) GPA tích lũy ≥ **3.6/4.0**, (2) Không có môn nào dưới C, (3) Tham gia ≥ **2 hoạt động** ngoại khóa trong năm học đó.',
            citation: 'Quy chế học vụ.pdf — Điều 28, tr.41',
          },
        ],
      },
      {
        docIndex: 1,
        exchanges: [
          {
            user: 'Môn Trí tuệ nhân tạo có bao nhiêu tín chỉ?',
            ai: 'Môn **Trí tuệ nhân tạo** (AI-301) có **3 tín chỉ** lý thuyết và 1 tín chỉ thực hành, tổng cộng **4 tín chỉ**. Đây là môn học bắt buộc dành cho sinh viên năm 3, ngành CNTT.',
            citation: 'Đề cương môn học.docx — Phần 2, tr.8',
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
        <img src="assets/logo.jpg" alt="DragonDoc AI" class="chat-avatar-img">
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
