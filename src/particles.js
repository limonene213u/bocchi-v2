// 🎨 パーティクルクラス
class Particle {
    constructor(ctx) {
      this.ctx = ctx;
      this.x = Math.random() * ctx.canvas.width;
      this.y = Math.random() * ctx.canvas.height; // ランダムな高さ
      this.radius = Math.random() * 3 + 1; // サイズにランダム性
      this.speed = Math.random() * 2 + 1; // 速度にもランダム性
      this.color = `hsl(${Math.random() * 360}, 100%, 75%)`; // ランダムな色
    }
  
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
  
    update() {
      this.y += this.speed;
      if (this.y > this.ctx.canvas.height) this.y = -this.radius; // 画面下に行ったら上に戻す
    }
  }
  
  // 🌌 パーティクルを管理するクラス
  class ParticleSystem {
    constructor(canvasId, numParticles = 100) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.numParticles = numParticles;
      this.particles = [];
      this.init();
      window.addEventListener('resize', () => this.resizeCanvas()); // 画面サイズ変更時に調整
    }
  
    init() {
      this.resizeCanvas();
      this.particles = Array.from({ length: this.numParticles }, () => new Particle(this.ctx));
      this.animate();
    }
  
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // 🚀 パーティクルシステムを起動
  const particles = new ParticleSystem('projector');
  