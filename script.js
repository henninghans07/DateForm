let neinCount = 0;
let selectedTime = '';
let selectedActivity = '';

const btnNein = document.getElementById('btnNein');
const btnJa = document.getElementById('btnJa');

// Nein-Button initialisieren (fixed position)
function initNeinBtn() {
  const rect = btnJa.getBoundingClientRect();
  btnNein.style.left = (rect.right + 20) + 'px';
  btnNein.style.top = rect.top + 'px';
}

function fleeNein(e) {
  if (e) e.preventDefault();
  neinCount++;

  // Ja-Button wächst
  const scale = 1 + neinCount * 0.15;
  btnJa.style.transform = `scale(${scale})`;

  // Zufällige Position (Rand-Padding beachten)
  const pad = 20;
  const w = window.innerWidth - btnNein.offsetWidth - pad;
  const h = window.innerHeight - btnNein.offsetHeight - pad;
  const x = Math.random() * (w - pad) + pad;
  const y = Math.random() * (h - pad) + pad;

  btnNein.style.left = x + 'px';
  btnNein.style.top = y + 'px';
}

btnNein.addEventListener('mouseover', fleeNein);
btnNein.addEventListener('click', fleeNein);
btnNein.addEventListener('touchstart', fleeNein, { passive: false });

// Herzchen-Regen
function spawnHeart() {
  const container = document.getElementById('hearts');
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = ['💕', '💖', '💗', '💓', '🩷'][Math.floor(Math.random() * 5)];
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

function selectTime(val) {
  selectedTime = val;
  showStep('step3');
}

function selectActivity(val) {
  selectedActivity = val;
  showSummary();
}

function showSummary() {
  document.getElementById('summary').innerHTML =
    `📅 <strong>Wann:</strong> ${selectedTime}<br>🎯 <strong>Was:</strong> ${selectedActivity}`;
  showStep('step4');
}

// Nein-Button nach Resize neu positionieren
window.addEventListener('resize', () => {
  fleeNein();
});

// Initial positionieren sobald DOM bereit
window.addEventListener('load', initNeinBtn);
