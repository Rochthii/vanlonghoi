// =========================================================
// DRAGONDOC AI — Particles Canvas
// Dragon Energy Background System
// =========================================================

class DragonParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.nodes = [];
    this.animationId = null;
    this.mouseX = 0;
    this.mouseY = 0;

    this.config = {
      particleCount: 80,
      nodeCount: 20,
      connectionDistance: 140,
      mouseRepelDistance: 80,
      particleColor: [0, 229, 255],   // Cyan - Dragon energy
      nodeColor: [0, 112, 243],       // Blue - Dragon core
      lineOpacity: 0.12,
      particleSpeed: 0.4,
      pulseSpeed: 0.02,
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.resize();

    // Dragon energy particles
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        type: 'particle',
      });
    }

    // Knowledge graph nodes
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed * 0.4,
        vy: (Math.random() - 0.5) * this.config.particleSpeed * 0.4,
        radius: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        type: 'node',
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  updateParticle(p) {
    p.pulse += this.config.pulseSpeed;
    p.x += p.vx;
    p.y += p.vy;

    // Mouse repulsion
    const dx = p.x - this.mouseX;
    const dy = p.y - this.mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.config.mouseRepelDistance) {
      const force = (this.config.mouseRepelDistance - dist) / this.config.mouseRepelDistance;
      p.vx += (dx / dist) * force * 0.02;
      p.vy += (dy / dist) * force * 0.02;
    }

    // Velocity clamping & damping
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const maxSpeed = this.config.particleSpeed * 2;
    if (speed > maxSpeed) {
      p.vx = (p.vx / speed) * maxSpeed;
      p.vy = (p.vy / speed) * maxSpeed;
    }
    p.vx *= 0.998;
    p.vy *= 0.998;

    // Wrap around edges
    if (p.x < -10) p.x = this.canvas.width + 10;
    if (p.x > this.canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = this.canvas.height + 10;
    if (p.y > this.canvas.height + 10) p.y = -10;
  }

  drawParticle(p) {
    const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
    const [r, g, b] = p.type === 'node' ? this.config.nodeColor : this.config.particleColor;
    const pulseRadius = p.radius + Math.sin(p.pulse) * 0.5;

    this.ctx.save();
    this.ctx.globalAlpha = pulseOpacity;

    // Outer glow
    const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseRadius * 3);
    gradient.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, pulseRadius * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Core particle
    this.ctx.fillStyle = `rgba(${r},${g},${b},${pulseOpacity})`;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawConnections(allPoints) {
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        const dx = allPoints[i].x - allPoints[j].x;
        const dy = allPoints[i].y - allPoints[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.connectionDistance) {
          const opacity = (1 - dist / this.config.connectionDistance) * this.config.lineOpacity;
          // Bias connection color towards cyan for nodes, blue for particles
          const [r, g, b] = (allPoints[i].type === 'node' || allPoints[j].type === 'node')
            ? this.config.nodeColor
            : this.config.particleColor;

          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(allPoints[i].x, allPoints[i].y);
          this.ctx.lineTo(allPoints[j].x, allPoints[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const allPoints = [...this.particles, ...this.nodes];

    // Update positions
    allPoints.forEach(p => this.updateParticle(p));

    // Draw connections
    this.drawConnections(allPoints);

    // Draw particles & nodes
    allPoints.forEach(p => this.drawParticle(p));

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new DragonParticles('bg-canvas');
});
