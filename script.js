(() => {
  'use strict';

  const intro = document.getElementById('intro');
  const letterScreen = document.getElementById('letter');
  const letterCard = document.getElementById('letterCard');
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('openBtn');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseText = document.getElementById('surpriseText');
  const resetBtn = document.getElementById('resetBtn');
  const particlesBox = document.getElementById('particles');

  const MAX_PARTICLES = 45;
  let busy = false;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nextFrame = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* ---------- Partículas flutuantes ---------- */

  function spawnParticle({ fast = false } = {}) {
    if (particlesBox.childElementCount >= MAX_PARTICLES) return;

    const spark = Math.random() < 0.25;
    const p = document.createElement('span');

    p.className = 'particle ' + (spark ? 'spark' : 'heart');
    p.textContent = spark ? '✦' : (Math.random() < 0.5 ? '❤' : '♥');
    p.style.setProperty('--x', rand(2, 96).toFixed(1) + '%');
    p.style.fontSize = rand(spark ? 10 : 14, spark ? 16 : 26).toFixed(0) + 'px';
    p.style.animationDuration = (fast ? rand(2.5, 4) : rand(9, 16)).toFixed(1) + 's';

    p.addEventListener('animationend', () => p.remove());
    particlesBox.appendChild(p);
  }

  function startParticles() {
    for (let i = 0; i < 12; i++) spawnParticle();
    setInterval(() => spawnParticle(), 650);
  }

  /* ---------- Sequência de entrada da carta ---------- */

  // Define a ordem de surgimento dos elementos da carta
  letterCard.querySelectorAll('.stagger').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });

  async function openLetter() {
    if (busy) return;
    busy = true;
    openBtn.disabled = true;

    // 1. Selo desaparece, aba abre, papel sai, envelope diminui
    envelope.classList.add('open');
    await wait(1900);

    // 2. Ecrã inicial desvanece
    intro.classList.add('fade-out');
    await wait(650);

    // 3. Carta cresce até ao centro e o texto aparece gradualmente
    intro.classList.remove('active', 'fade-out');
    letterScreen.classList.add('active');
    window.scrollTo(0, 0);
    await nextFrame();
    letterCard.classList.add('show');
  }

  /* ---------- Surpresa final ---------- */

  function revealSurprise() {
    surpriseBtn.hidden = true;
    surpriseText.hidden = false;

    nextFrame().then(() => surpriseText.classList.add('visible'));

    for (let i = 0; i < 16; i++) {
      setTimeout(() => spawnParticle({ fast: true }), i * 70);
    }
  }

  /* ---------- Reiniciar ---------- */

  async function resetLetter() {
    letterCard.classList.remove('show');
    letterScreen.classList.add('fade-out');
    await wait(900);

    letterScreen.classList.remove('active', 'fade-out');
    envelope.classList.remove('open');

    surpriseBtn.hidden = false;
    surpriseText.hidden = true;
    surpriseText.classList.remove('visible');

    intro.classList.add('active', 'fade-out');
    await nextFrame();
    intro.classList.remove('fade-out');

    openBtn.disabled = false;
    busy = false;
  }

  /* ---------- Eventos ---------- */

  openBtn.addEventListener('click', openLetter);
  envelope.addEventListener('click', openLetter);
  surpriseBtn.addEventListener('click', revealSurprise);
  resetBtn.addEventListener('click', resetLetter);

  startParticles();
})();
