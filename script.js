'use strict';
/* ═══════════════════════════════════════════════════════
   ATM 8 İLLİK YUBİLEY — SCRIPT.JS (v2)
   LocalStorage ilə data saxlama + Auto-play + Loop
   ═══════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
//  DEFAULT DATA
// ──────────────────────────────────────────────────────
const DEFAULT_DATA = {
  director: {
    name: 'Ad Soyad',
    description: 'Aqrar Tədqiqatlar Mərkəzinin rəhbəri kimi, son 8 ildə elmə, innovasiyaya və aqrar sahənin inkişafına sonsuz töhfə vermişdir.',
    quote: '"Gələcəyi birlikdə araşdırırıq, yaradırıq!"',
    statYears: '8', statProjects: '100+', statStaff: '50+',
    photo: null
  },
  team: [
    { id: 1, name: 'Ad Soyad', position: 'Baş Direktor müavini', dept: 'Rəhbərlik',         photo: null },
    { id: 2, name: 'Ad Soyad', position: 'Elm üzrə direktor',    dept: 'Elmi Şura',         photo: null },
    { id: 3, name: 'Ad Soyad', position: 'Maliyyə direktoru',    dept: 'Maliyyə',           photo: null },
    { id: 4, name: 'Ad Soyad', position: 'HR direktoru',         dept: 'İnsan Resursları',  photo: null },
  ],
  staff: [
    { id: 1,  name: 'Ad Soyad', dept: 'Bitkiçilik şöbəsi',        photo: null },
    { id: 2,  name: 'Ad Soyad', dept: 'Heyvandarlıq şöbəsi',      photo: null },
    { id: 3,  name: 'Ad Soyad', dept: 'Aqrokimya laboratoriyası', photo: null },
    { id: 4,  name: 'Ad Soyad', dept: 'İT şöbəsi',                photo: null },
    { id: 5,  name: 'Ad Soyad', dept: 'Aqronomiya şöbəsi',        photo: null },
    { id: 6,  name: 'Ad Soyad', dept: 'Ekologiya şöbəsi',         photo: null },
    { id: 7,  name: 'Ad Soyad', dept: 'Layihə idarəetməsi',       photo: null },
    { id: 8,  name: 'Ad Soyad', dept: 'Beynəlxalq əlaqələr',      photo: null },
    { id: 9,  name: 'Ad Soyad', dept: 'Tədqiqat şöbəsi',          photo: null },
    { id: 10, name: 'Ad Soyad', dept: 'Hüquq şöbəsi',             photo: null },
    { id: 11, name: 'Ad Soyad', dept: 'Mühasibat',                 photo: null },
    { id: 12, name: 'Ad Soyad', dept: 'Texnologiya şöbəsi',        photo: null },
    { id: 13, name: 'Ad Soyad', dept: 'Ərzaq təhlükəsizliyi',     photo: null },
    { id: 14, name: 'Ad Soyad', dept: 'Torpaqşünaslıq',            photo: null },
    { id: 15, name: 'Ad Soyad', dept: 'İnkişaf şöbəsi',            photo: null },
    { id: 16, name: 'Ad Soyad', dept: 'Arxiv & Sənəd',             photo: null },
  ],
  settings: {
    autoPlay: true,
    interval: 10,
    introImage: null
  }
};

// ──────────────────────────────────────────────────────
//  DATA LOAD / SAVE
// ──────────────────────────────────────────────────────
function loadData() {
  try {
    const stored = localStorage.getItem('atm_data');
    if (!stored) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const parsed = JSON.parse(stored);
    // Merge to ensure all keys exist
    return {
      director: { ...DEFAULT_DATA.director, ...parsed.director },
      team:     parsed.team  || DEFAULT_DATA.team,
      staff:    parsed.staff || DEFAULT_DATA.staff,
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings }
    };
  } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}

const DATA = loadData();
const TOTAL_SLIDES = 5;

// ──────────────────────────────────────────────────────
//  SLAYD SİSTEMİ
// ──────────────────────────────────────────────────────
let currentSlide = 0;
let isAnimating  = false;

const container  = document.getElementById('slidesContainer');
const navDots    = document.querySelectorAll('.nav-dot');
const arrowUp    = document.getElementById('arrowUp');
const arrowDown  = document.getElementById('arrowDown');

function goToSlide(index) {
  if (isAnimating) return;
  // Loop: son slayddan sonra birinciyə qayıt
  if (index >= TOTAL_SLIDES) index = 0;
  if (index < 0) index = TOTAL_SLIDES - 1;
  if (index === currentSlide && index !== 0) return;

  isAnimating   = true;
  currentSlide  = index;

  container.style.transform = `translateY(-${currentSlide * 100}vh)`;

  navDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  arrowUp.classList.toggle('hidden',  currentSlide === 0);
  arrowDown.classList.toggle('hidden', currentSlide === TOTAL_SLIDES - 1);

  if (currentSlide === TOTAL_SLIDES - 1) {
    setTimeout(launchConfetti, 700);
  }

  setTimeout(() => { isAnimating = false; }, 950);
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

navDots.forEach((dot, i) => dot.addEventListener('click', () => {
  resetAutoPlay(); goToSlide(i);
}));
arrowDown.addEventListener('click', () => { resetAutoPlay(); nextSlide(); });
arrowUp.addEventListener('click',   () => { resetAutoPlay(); prevSlide(); });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { resetAutoPlay(); nextSlide(); }
  if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { resetAutoPlay(); prevSlide(); }
});

let wheelCooldown = false;
document.addEventListener('wheel', e => {
  if (wheelCooldown) return;
  wheelCooldown = true;
  if (e.deltaY > 20)  { resetAutoPlay(); nextSlide(); }
  else if (e.deltaY < -20) { resetAutoPlay(); prevSlide(); }
  setTimeout(() => { wheelCooldown = false; }, 1000);
}, { passive: true });

let touchStartY = 0;
document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) {
    resetAutoPlay();
    if (diff > 0) nextSlide(); else prevSlide();
  }
}, { passive: true });

// İlk yükləmə
arrowUp.classList.add('hidden');

// ──────────────────────────────────────────────────────
//  AUTO-PLAY
// ──────────────────────────────────────────────────────
let autoPlayTimer    = null;
let progressTimer    = null;
let isAutoPlaying    = DATA.settings.autoPlay;
let timeLeft         = DATA.settings.interval;
const INTERVAL_SEC   = DATA.settings.interval;

const progressBar = document.getElementById('progressBar');
const apToggle    = document.getElementById('apToggle');
const apIcon      = document.getElementById('apIcon');
const apTimerEl   = document.getElementById('apTimer');

function startAutoPlay() {
  if (!isAutoPlaying) return;
  clearAllTimers();
  timeLeft = INTERVAL_SEC;
  updateProgress();

  progressTimer = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft < 0) timeLeft = 0;
    updateProgress();
  }, 100);

  autoPlayTimer = setTimeout(() => {
    nextSlide();
    if (isAutoPlaying) startAutoPlay();
  }, INTERVAL_SEC * 1000);
}

function updateProgress() {
  const pct = ((INTERVAL_SEC - timeLeft) / INTERVAL_SEC) * 100;
  progressBar.style.width = pct + '%';
  apTimerEl.textContent   = Math.ceil(timeLeft);
}

function stopAutoPlay() {
  clearAllTimers();
  progressBar.style.width = '0%';
  apTimerEl.textContent   = '—';
}

function clearAllTimers() {
  if (autoPlayTimer) { clearTimeout(autoPlayTimer);  autoPlayTimer = null; }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
}

function resetAutoPlay() {
  if (isAutoPlaying) startAutoPlay();
}

function toggleAutoPlay() {
  isAutoPlaying = !isAutoPlaying;
  apIcon.textContent = isAutoPlaying ? '⏸' : '▶';
  if (isAutoPlaying) startAutoPlay(); else stopAutoPlay();
}

apToggle.addEventListener('click', toggleAutoPlay);

// ──────────────────────────────────────────────────────
//  DİREKTOR RENDER
// ──────────────────────────────────────────────────────
function renderDirector() {
  const d = DATA.director;
  document.getElementById('directorName').textContent    = d.name;
  document.getElementById('directorDesc').textContent    = d.description;
  document.getElementById('directorQuote').textContent   = d.quote;
  document.getElementById('statYears').textContent       = d.statYears;
  document.getElementById('statProjects').textContent    = d.statProjects;
  document.getElementById('statStaff').textContent       = d.statStaff;

  const inner = document.getElementById('directorPhotoInner');
  if (d.photo) {
    inner.innerHTML = `<img src="${d.photo}" alt="Baş Direktor" />`;
  }
}

// ──────────────────────────────────────────────────────
//  KOMANDA RENDER
// ──────────────────────────────────────────────────────
function renderTeamGrid() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = '';

  DATA.team.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.style.animationDelay = `${idx * 0.08}s`;

    const photoHTML = m.photo
      ? `<img src="${m.photo}" alt="${m.name}" />`
      : `<div class="team-ph-icon">👤</div>`;

    card.innerHTML = `
      <div class="team-photo-wrap">
        <div class="team-photo-inner">${photoHTML}</div>
        <div class="team-role-badge">${m.dept}</div>
      </div>
      <div class="team-name">${m.name}</div>
      <div class="team-position">${m.position}</div>
    `;
    grid.appendChild(card);
  });
}

// ──────────────────────────────────────────────────────
//  STAFF TICKER RENDER
// ──────────────────────────────────────────────────────
function makeStaffCard(person) {
  const card = document.createElement('div');
  card.className = 'staff-card';
  const photoHTML = person.photo
    ? `<img src="${person.photo}" alt="${person.name}" />`
    : `<div class="staff-ph-icon">👤</div>`;
  card.innerHTML = `
    <div class="staff-photo-inner">${photoHTML}</div>
    <div class="staff-info">
      <div class="staff-name">${person.name}</div>
      <div class="staff-dept">${person.dept}</div>
    </div>
  `;
  return card;
}

function renderStaffTickers() {
  const staff  = DATA.staff;
  const half   = Math.ceil(staff.length / 2);
  const row1   = staff.slice(0, half);
  const row2   = staff.slice(half);

  const t1 = document.getElementById('staffTicker');
  const t2 = document.getElementById('staffTicker2');
  if (!t1 || !t2) return;
  t1.innerHTML = ''; t2.innerHTML = '';

  // Double for infinite scroll
  [...row1, ...row1].forEach(p => t1.appendChild(makeStaffCard(p)));
  [...row2, ...row2].forEach(p => t2.appendChild(makeStaffCard(p)));
}

// ──────────────────────────────────────────────────────
//  GİRİŞ ŞƏKLİ
// ──────────────────────────────────────────────────────
function renderIntroImage() {
  const poster = document.getElementById('introPoster');
  const ph     = document.getElementById('introPosterPh');
  const imgSrc = DATA.settings.introImage;

  if (imgSrc) {
    poster.src = imgSrc;
    poster.style.display = 'block';
    ph.style.display = 'none';
  } else {
    // images/ qovluğundakı şəkli yoxla
    poster.src = 'images/anniversary-poster.jpg';
    poster.onerror = () => {
      poster.style.display = 'none';
      ph.style.display = 'flex';
    };
    poster.onload = () => {
      poster.style.display = 'block';
      ph.style.display = 'none';
    };
  }
}

// ──────────────────────────────────────────────────────
//  PARTİKLLƏR
// ──────────────────────────────────────────────────────
function createParticles() {
  const cont = document.getElementById('introParticles');
  if (!cont) return;
  const colors = ['#c9a84c','#6fcf97','#f0d080','#4caf72','rgba(255,255,255,0.6)'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*10}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*8+5}s;
      animation-delay:${Math.random()*6}s;
    `;
    cont.appendChild(p);
  }
}

// ──────────────────────────────────────────────────────
//  KONFETİ
// ──────────────────────────────────────────────────────
function launchConfetti() {
  const cont = document.getElementById('confetti');
  if (!cont || cont.childElementCount > 0) return;
  const colors  = ['#c9a84c','#f0d080','#6fcf97','#2d8a4e','#fff','#4caf72'];
  const shapes  = ['◆','●','▲','■','★','✦'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const color = colors[Math.floor(Math.random()*colors.length)];
    c.textContent = shapes[Math.floor(Math.random()*shapes.length)];
    c.style.cssText = `
      left:${Math.random()*100}%;
      color:${color};
      font-size:${Math.random()*12+7}px;
      animation-duration:${Math.random()*4+3}s;
      animation-delay:${Math.random()*3}s;
      width:auto; height:auto; border-radius:0; background:transparent;
    `;
    cont.appendChild(c);
  }
}

// ──────────────────────────────────────────────────────
//  İNİT
// ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderIntroImage();
  renderDirector();
  renderTeamGrid();
  renderStaffTickers();
  createParticles();

  apIcon.textContent = isAutoPlaying ? '⏸' : '▶';
  if (isAutoPlaying) startAutoPlay();
});
