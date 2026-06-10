let neinCount = 0;
let selectedTime = '';
let selectedActivity = '';
let isFleeing = false;   // verhindert Mouseover-Dauerbeschuss
let touchFired = false;  // verhindert Doppelzählung touch+click auf Mobile

const btnNein = document.getElementById('btnNein');
const btnJa   = document.getElementById('btnJa');

function handleNein() {
  neinCount++;

  if (neinCount >= 3) {
    showStep('stepNein');
    return;
  }

  // Ja-Button wächst
  btnJa.style.transform = `scale(${1 + neinCount * 0.12})`;

  // Nein-Button springt an zufällige Bildschirmposition
  const pad = 16;
  const bw  = btnNein.offsetWidth  || 110;
  const bh  = btnNein.offsetHeight || 44;
  const x   = Math.random() * (window.innerWidth  - bw  - pad * 2) + pad;
  const y   = Math.random() * (window.innerHeight - bh  - pad * 2) + pad;

  btnNein.style.position = 'fixed';
  btnNein.style.left     = x + 'px';
  btnNein.style.top      = y + 'px';
  btnNein.style.zIndex   = 999;

  // Mouseover darf erst wieder auslösen, wenn Cursor den Button verlässt
  isFleeing = true;
}

// Klick (Desktop)
btnNein.addEventListener('click', () => {
  if (touchFired) { touchFired = false; return; } // touch hat schon gezählt
  handleNein();
});

// Touch (Mobil) – verhindert außerdem das Ghost-Click danach
btnNein.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchFired = true;
  handleNein();
}, { passive: false });

// Hover flüchtet nur NACH dem ersten Klick und nur einmal pro Annäherung
btnNein.addEventListener('mouseover', () => {
  if (neinCount > 0 && neinCount < 3 && !isFleeing) {
    handleNein();
  }
});

btnNein.addEventListener('mouseleave', () => {
  isFleeing = false; // Button darf beim nächsten Hover wieder fliehen
});

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
  // Min-Datum erst setzen wenn Input sichtbar ist
  const dp = document.getElementById('datePicker');
  dp.min = new Date().toISOString().split('T')[0];
}

function confirmDate() {
  const dp  = document.getElementById('datePicker');
  const val = dp.value;
  if (!val) {
    dp.style.outline = '2px solid #e91e63';
    dp.focus();
    return;
  }
  dp.style.outline = '';
  const [y, m, d] = val.split('-');
  selectedTime = `${d}.${m}.${y}`;
  showStep('step3');
}

function selectActivity(val) {
  selectedActivity = val;
  document.getElementById('summary').innerHTML =
    `📅 <strong>Datum:</strong> ${selectedTime}<br>🎯 <strong>Was:</strong> ${selectedActivity}`;
  showStep('step4');
  sendTelegram(selectedTime, selectedActivity);
}

function sendTelegram(wann, was) {
  const token  = '8999140152:AAFRq0MHMZzF_xqCFBuw7G_CWlJnelZM4x0';
  const chatId = '8732673076';
  const text   = `💕 Selina hat zugestimmt!\n\n📅 Datum: ${wann}\n🎯 Was: ${was}`;
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
