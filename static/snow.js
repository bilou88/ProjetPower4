/* MAPAMOBI — Effet de neige ❄️ */
(() => {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let snowflakes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Réinitialiser la densité de la neige
    snowflakes = Array.from({ length: Math.floor(width / 6) }, () => newFlake());
  }

  function newFlake() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1, // rayon
      d: Math.random() * 0.5 + 0.5, // densité (vitesse verticale)
      drift: Math.random() * 1 - 0.5, // déplacement horizontal léger
      alpha: Math.random() * 0.5 + 0.3 // opacité
    };
  }

  function update() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.beginPath();

    for (const flake of snowflakes) {
      ctx.globalAlpha = flake.alpha;
      ctx.moveTo(flake.x, flake.y);
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    }

    ctx.fill();
    ctx.globalAlpha = 1;

    // mise à jour des positions
    for (const flake of snowflakes) {
      flake.y += flake.d;
      flake.x += flake.drift * 0.5;

      if (flake.y > height) {
        flake.y = -flake.r;
        flake.x = Math.random() * width;
      }
    }

    requestAnimationFrame(update);
  }

  resize();
  update();
  window.addEventListener('resize', resize);
})();