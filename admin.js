'use strict';
/* ═══════════════════════════════════════════════════════
   ATM ADMIN PANEL — ADMIN.JS
   LocalStorage ilə tam CRUD idarəetməsi
   ═══════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
//  DEFAULT DATA (script.js ilə eyni)
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
    { id: 1, name: 'Ad Soyad', position: 'Baş Direktor müavini', dept: 'Rəhbərlik',        photo: null },
    { id: 2, name: 'Ad Soyad', position: 'Elm üzrə direktor',    dept: 'Elmi Şura',        photo: null },
    { id: 3, name: 'Ad Soyad', position: 'Maliyyə direktoru',    dept: 'Maliyyə',          photo: null },
    { id: 4, name: 'Ad Soyad', position: 'HR direktoru',         dept: 'İnsan Resursları', photo: null },
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
  settings: { autoPlay: true, interval: 10, introImage: null }
};

// ──────────────────────────────────────────────────────
//  DATA LOAD / SAVE
// ──────────────────────────────────────────────────────
function loadData() {
  try {
    const s = localStorage.getItem('atm_data');
    if (!s) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const p = JSON.parse(s);
    return {
      director: { ...DEFAULT_DATA.director, ...p.director },
      team:     p.team  || DEFAULT_DATA.team,
      staff:    p.staff || DEFAULT_DATA.staff,
      settings: { ...DEFAULT_DATA.settings, ...p.settings }
    };
  } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}

function persistData() {
  localStorage.setItem('atm_data', JSON.stringify(DATA));
}

const DATA = loadData();
let idCounter = 1000;

// ──────────────────────────────────────────────────────
//  TAB SİSTEMİ
// ──────────────────────────────────────────────────────
const TAB_TITLES = {
  dashboard: 'Dashboard',
  intro:     'Giriş Slaydı',
  director:  'Baş Direktor',
  team:      'Rəhbər Heyət',
  staff:     'Əməkdaşlar',
  settings:  'Parametrlər'
};

function switchTab(tabName) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(t => {
    t.classList.toggle('active', t.id === `tab-${tabName}`);
  });
  document.getElementById('topbarTitle').textContent = TAB_TITLES[tabName] || tabName;
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => switchTab(item.dataset.tab));
});

// ──────────────────────────────────────────────────────
//  TOAST BİLDİRİŞ
// ──────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isError ? '#7a2020' : 'var(--green-mid)';
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ──────────────────────────────────────────────────────
//  ŞƏKİL YÜKLƏMƏ (base64)
// ──────────────────────────────────────────────────────
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function setPreviewImage(previewEl, src) {
  previewEl.innerHTML = src
    ? `<img src="${src}" alt="preview" />`
    : `<div class="puz-placeholder"><div class="puz-icon">🖼️</div><div class="puz-text">Şəkil seçin</div></div>`;
}

function setCirclePreview(previewEl, src) {
  previewEl.innerHTML = src
    ? `<img src="${src}" alt="preview" />`
    : `<div class="puz-placeholder"><div class="puz-icon">👤</div><div class="puz-text">Şəkil seçin</div></div>`;
}

// ──────────────────────────────────────────────────────
//  GİRİŞ SLAYDİ
// ──────────────────────────────────────────────────────
function handleIntroPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  readFileAsBase64(file).then(b64 => {
    DATA.settings.introImage = b64;
    setPreviewImage(document.getElementById('introPosterPreview'), b64);
  });
}

function removeIntroPhoto() {
  DATA.settings.introImage = null;
  setPreviewImage(document.getElementById('introPosterPreview'), null);
  document.getElementById('introPhotoInput').value = '';
}

function renderIntroTab() {
  const prev = document.getElementById('introPosterPreview');
  setPreviewImage(prev, DATA.settings.introImage);
}

// ──────────────────────────────────────────────────────
//  DİREKTOR
// ──────────────────────────────────────────────────────
function handleDirectorPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  readFileAsBase64(file).then(b64 => {
    DATA.director.photo = b64;
    setCirclePreview(document.getElementById('directorPhotoPreview'), b64);
  });
}

function removeDirectorPhoto() {
  DATA.director.photo = null;
  setCirclePreview(document.getElementById('directorPhotoPreview'), null);
  document.getElementById('directorPhotoInput').value = '';
}

function renderDirectorTab() {
  const d = DATA.director;
  document.getElementById('dir-name').value         = d.name         || '';
  document.getElementById('dir-desc').value         = d.description  || '';
  document.getElementById('dir-quote').value        = d.quote        || '';
  document.getElementById('dir-stat-years').value   = d.statYears    || '';
  document.getElementById('dir-stat-projects').value = d.statProjects || '';
  document.getElementById('dir-stat-staff').value   = d.statStaff    || '';
  setCirclePreview(document.getElementById('directorPhotoPreview'), d.photo);
}

function collectDirectorData() {
  DATA.director.name         = document.getElementById('dir-name').value.trim();
  DATA.director.description  = document.getElementById('dir-desc').value.trim();
  DATA.director.quote        = document.getElementById('dir-quote').value.trim();
  DATA.director.statYears    = document.getElementById('dir-stat-years').value.trim();
  DATA.director.statProjects = document.getElementById('dir-stat-projects').value.trim();
  DATA.director.statStaff    = document.getElementById('dir-stat-staff').value.trim();
}

// ──────────────────────────────────────────────────────
//  KOMANDA (TEAM)
// ──────────────────────────────────────────────────────
function renderTeamList() {
  const list = document.getElementById('teamList');
  list.innerHTML = '';
  DATA.team.forEach((m, idx) => {
    list.appendChild(buildMemberRow(m, idx, 'team', ['name','position','dept']));
  });
  document.getElementById('dash-team-count').textContent = `${DATA.team.length} nəfər`;
}

function addTeamMember() {
  const newMember = { id: ++idCounter, name: '', position: '', dept: '', photo: null };
  DATA.team.push(newMember);
  renderTeamList();
  // Scroll to bottom
  const list = document.getElementById('teamList');
  list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteTeamMember(id) {
  DATA.team = DATA.team.filter(m => m.id !== id);
  renderTeamList();
}

// ──────────────────────────────────────────────────────
//  ƏMƏKDAŞLAR (STAFF)
// ──────────────────────────────────────────────────────
function renderStaffList() {
  const list = document.getElementById('staffList');
  list.innerHTML = '';
  DATA.staff.forEach((m, idx) => {
    list.appendChild(buildMemberRow(m, idx, 'staff', ['name','dept']));
  });
  document.getElementById('dash-staff-count').textContent = `${DATA.staff.length} nəfər`;
}

function addStaffMember() {
  const newMember = { id: ++idCounter, name: '', dept: '', photo: null };
  DATA.staff.push(newMember);
  renderStaffList();
  const list = document.getElementById('staffList');
  list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteStaffMember(id) {
  DATA.staff = DATA.staff.filter(m => m.id !== id);
  renderStaffList();
}

// ──────────────────────────────────────────────────────
//  MEMBER ROW BUILDER
// ──────────────────────────────────────────────────────
const FIELD_PLACEHOLDERS = {
  name:     'Ad Soyad',
  position: 'Vəzifə',
  dept:     'Şöbə / Departament',
};

function buildMemberRow(member, idx, type, fields) {
  const row = document.createElement('div');
  row.className = 'member-row';
  row.dataset.id = member.id;

  // Photo
  const photoWrap = document.createElement('div');
  photoWrap.className = 'mr-photo-wrap';

  const photoDiv = document.createElement('div');
  photoDiv.className = 'mr-photo';
  photoDiv.id = `${type}-photo-${member.id}`;
  if (member.photo) {
    photoDiv.innerHTML = `<img src="${member.photo}" alt="${member.name}" />`;
  } else {
    photoDiv.textContent = '👤';
  }

  const overlay = document.createElement('div');
  overlay.className = 'mr-photo-overlay';
  overlay.textContent = '📷';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'mr-photo-file';
  fileInput.id = `${type}-file-${member.id}`;
  fileInput.addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;
    const b64 = await readFileAsBase64(file);
    member.photo = b64;
    photoDiv.innerHTML = `<img src="${b64}" alt="${member.name}" />`;
  });

  overlay.addEventListener('click', () => fileInput.click());
  photoWrap.appendChild(photoDiv);
  photoWrap.appendChild(overlay);
  photoWrap.appendChild(fileInput);

  // Inputs
  const inputsDiv = document.createElement('div');
  inputsDiv.className = 'mr-inputs';

  fields.forEach(field => {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'mr-input';
    inp.placeholder = FIELD_PLACEHOLDERS[field] || field;
    inp.value = member[field] || '';
    inp.addEventListener('input', () => { member[field] = inp.value; });
    inputsDiv.appendChild(inp);
  });

  // Delete btn
  const delBtn = document.createElement('button');
  delBtn.className = 'mr-delete';
  delBtn.textContent = '✕';
  delBtn.title = 'Sil';
  delBtn.addEventListener('click', () => {
    if (type === 'team')  deleteTeamMember(member.id);
    if (type === 'staff') deleteStaffMember(member.id);
  });

  row.appendChild(photoWrap);
  row.appendChild(inputsDiv);
  row.appendChild(delBtn);

  return row;
}

// ──────────────────────────────────────────────────────
//  PARAMETRLƏR
// ──────────────────────────────────────────────────────
function renderSettingsTab() {
  document.getElementById('set-autoplay').checked = DATA.settings.autoPlay;
  document.getElementById('set-interval').value   = DATA.settings.interval;
}

function collectSettingsData() {
  DATA.settings.autoPlay = document.getElementById('set-autoplay').checked;
  const iv = parseInt(document.getElementById('set-interval').value, 10);
  DATA.settings.interval = (isNaN(iv) || iv < 3) ? 3 : iv > 60 ? 60 : iv;
}

// ──────────────────────────────────────────────────────
//  GLOBAL SAVE
// ──────────────────────────────────────────────────────
function saveAll() {
  collectDirectorData();
  collectSettingsData();
  persistData();

  // Save status
  const ss = document.getElementById('saveStatus');
  ss.textContent = '✓ Saxlanıldı';
  ss.classList.add('visible');
  setTimeout(() => ss.classList.remove('visible'), 3000);

  showToast('✅ Bütün dəyişikliklər saxlanıldı!');
}

// Keyboard shortcut: Ctrl+S
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveAll();
  }
});

// ──────────────────────────────────────────────────────
//  RESET
// ──────────────────────────────────────────────────────
function confirmReset() {
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function resetAll() {
  localStorage.removeItem('atm_data');
  closeModal();
  showToast('🔄 Məlumatlar sıfırlandı. Yüklənir...');
  setTimeout(() => location.reload(), 1200);
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ──────────────────────────────────────────────────────
//  DASHBOARD SAYLAR
// ──────────────────────────────────────────────────────
function updateDashboardCounts() {
  document.getElementById('dash-team-count').textContent  = `${DATA.team.length} nəfər`;
  document.getElementById('dash-staff-count').textContent = `${DATA.staff.length} nəfər`;
}

// ──────────────────────────────────────────────────────
//  İNİT
// ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderIntroTab();
  renderDirectorTab();
  renderTeamList();
  renderStaffList();
  renderSettingsTab();
  updateDashboardCounts();

  // Auto-save on input changes (debounced)
  let autoSaveTimer = null;
  document.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      collectDirectorData();
      collectSettingsData();
      persistData();
      const ss = document.getElementById('saveStatus');
      ss.textContent = '✓ Avtomatik saxlanıldı';
      ss.classList.add('visible');
      setTimeout(() => ss.classList.remove('visible'), 2000);
    }, 1500);
  });
});
