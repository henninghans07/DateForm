let neinCount = 0;
let selectedTime = '';
let selectedActivity = '';

const btnNein = document.getElementById('btnNein');
const btnJa = document.getElementById('btnJa');
const btnContainer = document.getElementById('btnContainer');

// Nein-Button: bewegt sich bei jedem Klick ein Stück weg (innerhalb der Karte)
function handleNein() {
  neinCount++;

  if (neinCount >= 3) {
    showStep('stepNein');
    return;
  }

  // Ja-Button wächst leicht
  const scale = 1 + neinCount * 0.12;
  btnJa.style.transform = `scale(${scale})`;

  // Nein-Button springt an zufällige absolute Position auf dem Bildschirm
  const pad = 16;
  const bw = btnNein.offsetWidth || 100;
  const bh = btnNein.offsetHeight || 44;
  const maxX = window.innerWidth  - bw - pad;
  const maxY = window.innerHeight - bh - pad;
  const x = Math.random() * (maxX - pad) + pad;
  const y = Math.random() * (maxY - pad) + pad;

  btnNein.style.position = 'fixed';
  btnNein.style.left = x + 'px';
  btnNein.style.top  = y + 'px';
  btnNein.style.zIndex = 999;
}

// Erstes Hover / Touch löst auch Flucht aus (nur nach dem ersten Klick)
btnNein.addEventListener('mouseover', () => {
  if (neinCount > 0 && neinCount < 3) handleNein();
});
btnNein.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleNein();
}, { passive: false });

// Datum-Picker: Minimum = heute
const datePicker = document.getElementById('datePicker');
const today = new Date().toISOString().split('T')[0];
datePicker.min = today;

// Herzchen-Regen
function spawnHeart() {
  const container = document.getElementById('hearts');
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = ['💕','💖','💗','💓','🩷'][Math.floor(Math.random() * 5)];
  heart.style.left = Math.random() * 100 + 'vw';
  const dur = 6 + Math.random() * 8;
  heart.style.animationDuration = dur + 's';
  heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  heart.style.animationDelay = (Math.random() * dur) + 's';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (dur + 2) * 1000);
}
setInterval(spawnHeart, 700);
for (let i = 0; i < 8; i++) spawnHeart();

// Schritt-Navigation
function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goToStep2() {
  showStep('step2');
}

function confirmDate() {
  const val = datePicker.value;
  if (!val) {
    datePicker.style.outline = '2px solid #e91e63';
    datePicker.focus();
    return;
  }
  datePicker.style.outline = '';
  // Datum schön formatieren: DD.MM.YYYY
  const [y, m, d] = val.split('-');
  selectedTime = `${d}.${m}.${y}`;
  showStep('step3');
}

function selectActivity(val) {
  selectedActivity = val;
  document.getElementById('summary').innerHTML =
    `📅 <strong>Datum:</strong> ${selectedTime}<br>🎯 <strong>Was:</strong> ${selectedActivity}`;
  showStep('step4');
}
