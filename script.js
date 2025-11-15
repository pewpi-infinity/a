const canvas = document.getElementById("quantumCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Node {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = 2 + Math.random() * 3;
    this.pulse = Math.random() * 2 * Math.PI;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    this.pulse += 0.02;
  }

  draw() {
    const glow = (Math.sin(this.pulse) + 1) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size + glow * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(142, 223, 255, ${0.2 + glow * 0.4})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#7cc5ff";
    ctx.fill();
  }
}

const NODES = [];
for (let i = 0; i < 120; i++) NODES.push(new Node());

function drawConnections() {
  for (let a = 0; a < NODES.length; a++) {
    for (let b = a + 1; b < NODES.length; b++) {
      const dx = NODES[a].x - NODES[b].x;
      const dy = NODES[a].y - NODES[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const alpha = 1 - dist / 150;
        ctx.strokeStyle = `rgba(70,150,255,${alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(NODES[a].x, NODES[a].y);
        ctx.lineTo(NODES[b].x, NODES[b].y);
        ctx.stroke();
        if (dist < 60) {
          ctx.strokeStyle = `rgba(0,200,255,${alpha * 0.1})`;
          ctx.beginPath();
          const midX = (NODES[a].x + NODES[b].x) / 2;
          const midY = (NODES[a].y + NODES[b].y) / 2;
          ctx.arc(midX, midY, 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  for (let n of NODES) {
    n.update();
    n.draw();
  }
  requestAnimationFrame(animate);
}
animate();
