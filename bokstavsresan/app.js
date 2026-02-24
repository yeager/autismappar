// Bokstavsresan PWA — Swedish letter learning game
// © 2026 Daniel Nylander / Autismappar.se
// Matches GTK4 Bokstavsresan v0.1.1 feature set

'use strict';

// ── Swedish phonetic data (from GTK4 source) ──────────────────────────
const LETTER_PHONETICS = {
  A:'ah',B:'beh',C:'seh',D:'deh',E:'eh',F:'eff',G:'geh',H:'hå',
  I:'ih',J:'jih',K:'kå',L:'ell',M:'emm',N:'enn',O:'oh',P:'peh',
  Q:'kuh',R:'err',S:'ess',T:'teh',U:'uh',V:'veh',W:'dubbelveh',
  X:'eks',Y:'yh',Z:'seta',Å:'å',Ä:'äh',Ö:'öh'
};

// Elongated phonetic sounds for clarity (dyspraxia-friendly, from GTK4)
const LETTER_SOUNDS = {
  A:'aaa',B:'bbb',C:'sss',D:'ddd',E:'eee',F:'fff',G:'ggg',H:'hhh',
  I:'iii',J:'jjj',K:'kkk',L:'lll',M:'mmm',N:'nnn',O:'ooo',P:'ppp',
  Q:'kkk',R:'rrr',S:'sss',T:'ttt',U:'uuu',V:'vvv',W:'vvv',
  X:'ks',Y:'yyy',Z:'sss',Å:'ååå',Ä:'äää',Ö:'ööö'
};

const LETTERS = Object.keys(LETTER_PHONETICS); // A-Ö, 29 letters

// ── Word lists by difficulty ───────────────────────────────────────────
const WORDS_EASY = [
  ['SOL','sol'],['KAT','katt'],['HUS','hus'],['BIL','bil'],
  ['MUS','mus'],['HÅR','hår'],['BÅT','båt'],['ÖGA','öga'],
  ['ARM','arm'],['BEN','ben'],['LÅS','lås'],['NÄS','näsa']
];
const WORDS_MEDIUM = [
  ['BOLL','boll'],['LAMM','lamm'],['FISK','fisk'],['GRIS','gris'],
  ['HUND','hund'],['KATT','katt'],['STOL','stol'],['DÖRR','dörr'],
  ['BLAD','blad'],['SNÄL','snäll'],['GLAD','glad'],['STOR','stor']
];
const WORDS_HARD = [
  ['ÄPPLE','äpple'],['SKOLA','skola'],['BJÖRN','björn'],
  ['BLOMMA','blomma'],['STJÄRNA','stjärna'],['TRÄD','träd'],
  ['SJUNGA','sjunga'],['HIMMEL','himmel'],['VATTEN','vatten']
];

const ENCOURAGEMENTS = [
  'Bra jobbat! ⭐','Fantastiskt! 🌟','Du är en stjärna! ✨',
  'Otroligt! 🎉','Bra gjort! 👏','Fortsätt så! 💪',
  'Super! 🚀','Lysande! 🌈','Du klarade det! 🎊',
  'Wow! 🏆','Perfekt! 💯','Mästare! 🥇'
];
const TRY_AGAIN = [
  'Nästan! Försök igen! 💪','Så nära! En gång till! 🌟',
  'Du kan det! 🎯','Ge inte upp! 💫'
];

// ── Helpers ────────────────────────────────────────────────────────────
const $ = s => document.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ── TTS via Piper WASM (primary) with Web Speech API fallback ──────────
const PIPER_VOICE_ID = 'sv_SE-nst-medium';
let piperTTS = null;       // module reference once loaded
let piperReady = false;
let piperFailed = false;
let piperLoading = false;
let speakQueue = [];       // queue speech while loading

// Loading indicator
function showTTSLoading(show) {
  let el = document.getElementById('tts-loading');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'tts-loading';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#764ba2;color:#fff;text-align:center;padding:10px;font-size:14px;';
    el.innerHTML = '🔊 Laddar röstmodell… <span id="tts-loading-pct"></span>';
    document.body.prepend(el);
  }
  if (el && !show) el.remove();
}

function updateTTSProgress(progress) {
  const pctEl = document.getElementById('tts-loading-pct');
  if (pctEl && progress.total) {
    pctEl.textContent = Math.round(progress.loaded * 100 / progress.total) + '%';
  }
}

async function initPiper() {
  if (piperReady || piperFailed || piperLoading) return;
  piperLoading = true;
  try {
    piperTTS = await import('https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.4/+esm');
    // Pre-download model with progress indicator
    const stored = await piperTTS.stored();
    if (!stored.includes(PIPER_VOICE_ID)) {
      showTTSLoading(true);
      await piperTTS.download(PIPER_VOICE_ID, updateTTSProgress);
      showTTSLoading(false);
    }
    piperReady = true;
    piperLoading = false;
    // Flush queued speech
    for (const text of speakQueue) speak(text);
    speakQueue = [];
  } catch (err) {
    console.warn('Piper TTS init failed, falling back to Web Speech API:', err);
    piperFailed = true;
    piperLoading = false;
    showTTSLoading(false);
    initWebSpeechFallback();
    for (const text of speakQueue) speak(text);
    speakQueue = [];
  }
}

// Web Speech API fallback
let svVoice = null;
function initWebSpeechFallback() {
  if (!('speechSynthesis' in window)) return;
  const loadVoices = () => {
    svVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith('sv')) || null;
  };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function speakWebSpeech(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sv-SE';
  u.rate = 0.8;
  u.pitch = 1.1;
  u.volume = 0.9;
  if (svVoice) u.voice = svVoice;
  speechSynthesis.speak(u);
}

let currentAudio = null;

async function speakPiper(text) {
  try {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const wav = await piperTTS.predict({
      text: text,
      voiceId: PIPER_VOICE_ID,
    });
    const audio = new Audio();
    audio.src = URL.createObjectURL(wav);
    currentAudio = audio;
    audio.play();
  } catch (err) {
    console.warn('Piper speak error, using fallback:', err);
    speakWebSpeech(text);
  }
}

function speak(text) {
  if (piperReady) return speakPiper(text);
  if (piperFailed) return speakWebSpeech(text);
  // Still loading — queue it
  speakQueue.push(text);
}

// Start loading Piper immediately
initPiper();

// ── Sound effects (Web Audio) ──────────────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  return audioCtx;
}

function playTone(freqs, dur = 0.25, vol = 0.3) {
  const ctx = getAudioCtx(); if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  let t = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(f, t + i * dur);
    g.gain.setValueAtTime(vol, t + i * dur);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * dur + dur);
    o.start(t + i * dur); o.stop(t + i * dur + dur);
  });
}
const playSuccess = () => playTone([523, 659, 784]);
const playError   = () => playTone([200, 100], 0.3, 0.25);
const playLevelUp = () => playTone([523, 659, 784, 1047], 0.2, 0.4);

// ── Confetti ───────────────────────────────────────────────────────────
function confetti(n = 40) {
  const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#e91e63'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random() * 100 + '%';
    el.style.background = pick(colors);
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

// ── Progress store (localStorage) ──────────────────────────────────────
const PROGRESS_KEY = 'bokstavsresan_progress';
const defaultProgress = { letters_mastered: [], streak: 0, total_correct: 0, total_attempts: 0, stars: 0, level: 1 };

function loadProgress() {
  try { return { ...defaultProgress, ...JSON.parse(localStorage.getItem(PROGRESS_KEY)) }; } catch { return { ...defaultProgress }; }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }

// ── App ────────────────────────────────────────────────────────────────
const app = {
  progress: loadProgress(),
  mode: 'menu',
  targetLetter: null,
  currentWord: null,
  wordIdx: 0,

  init() {
    this.updateStats();
    this.updateProgressSummary();
    this.bindEvents();
    this.showPage('menu');

    // Welcome modal on first visit
    if (!localStorage.getItem('bokstavsresan_visited')) {
      localStorage.setItem('bokstavsresan_visited', '1');
      $('#welcome-modal').classList.remove('hidden');
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    }
  },

  bindEvents() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (btn) return this.handleAction(btn.dataset.action, btn);

      const modeBtn = e.target.closest('[data-mode]');
      if (modeBtn) return this.startMode(modeBtn.dataset.mode);

      const letterBtn = e.target.closest('.letter-btn');
      if (letterBtn) return this.handleLetterClick(letterBtn);
    });

    // Resume audio on first tap
    document.addEventListener('pointerdown', () => {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }, { once: true });
  },

  handleAction(action) {
    switch (action) {
      case 'back':         return this.showPage('menu');
      case 'replay-find':  return this.targetLetter && speak(LETTER_PHONETICS[this.targetLetter]);
      case 'next-find':    return this.startFindRound();
      case 'sound-current':return this.soundCurrentLetter();
      case 'next-sound':   return this.nextSound();
      case 'new-word':     return this.startSoundoutRound();
    }
    // Modal buttons
    if (action === undefined) {
      const t = event?.target;
      if (t?.id === 'welcome-start') $('#welcome-modal').classList.add('hidden');
      if (t?.id === 'levelup-ok')    $('#levelup-modal').classList.add('hidden');
    }
  },

  // ── Pages ──
  showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = $(`#page-${name}`);
    if (page) { page.classList.add('active'); this.mode = name; }
    this.updateProgressSummary();
  },

  startMode(mode) {
    this.showPage(mode);
    if (mode === 'explore') this.buildExploreGrid();
    if (mode === 'find')    { this.buildFindGrid(); this.startFindRound(); }
    if (mode === 'soundout') this.startSoundoutRound();
  },

  // ── Explore ──
  buildExploreGrid() {
    const grid = $('#explore-grid');
    grid.innerHTML = '';
    LETTERS.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      grid.appendChild(btn);
    });
    $('#explore-feedback').textContent = '';
    $('#explore-feedback').className = 'feedback';
  },

  handleLetterClick(btn) {
    const letter = btn.dataset.letter;
    if (this.mode === 'explore') this.onExploreLetter(letter, btn);
    else if (this.mode === 'find') this.onFindLetter(letter, btn);
  },

  onExploreLetter(letter, btn) {
    const name = LETTER_PHONETICS[letter];
    const sound = LETTER_SOUNDS[letter];
    const fb = $('#explore-feedback');
    fb.textContent = `${letter} — Namn: "${name}", Ljud: "${sound}"`;
    fb.className = 'feedback success';

    speak(`${letter}. ${name}. ${sound}.`);
    btn.classList.add('correct');
    setTimeout(() => btn.classList.remove('correct'), 500);

    this.recordCorrect(letter);
    playSuccess();
  },

  // ── Find the Letter ──
  buildFindGrid() {
    $('#find-grid').innerHTML = '';
    $('#find-feedback').textContent = '';
    $('#find-feedback').className = 'feedback';
    $('#find-next').classList.add('hidden');
  },

  startFindRound() {
    this.buildFindGrid();
    this.targetLetter = pick(LETTERS);

    const choices = shuffle([this.targetLetter, ...shuffle(LETTERS.filter(l => l !== this.targetLetter)).slice(0, 5)]);
    const grid = $('#find-grid');
    choices.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'letter-btn';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      grid.appendChild(btn);
    });

    const phonetic = LETTER_PHONETICS[this.targetLetter];
    $('#find-title').textContent = `🎯 Vilken bokstav säger "${phonetic}"?`;
    setTimeout(() => speak(phonetic), 600);
  },

  onFindLetter(letter, btn) {
    const fb = $('#find-feedback');
    if (letter === this.targetLetter) {
      fb.textContent = pick(ENCOURAGEMENTS);
      fb.className = 'feedback success';
      btn.classList.add('correct');
      this.recordCorrect(letter);
      playSuccess();
      $('#find-next').classList.remove('hidden');
      setTimeout(() => speak(pick(['Rätt!', 'Ja!', 'Bra!'])), 200);
    } else {
      fb.textContent = pick(TRY_AGAIN);
      fb.className = 'feedback error';
      btn.classList.add('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 800);
      this.recordWrong();
      playError();
    }
  },

  // ── Sound Out Words ──
  startSoundoutRound() {
    const lvl = this.progress.level;
    let words = WORDS_EASY;
    if (lvl >= 2) words = [...WORDS_EASY, ...WORDS_MEDIUM];
    if (lvl >= 3) words = [...WORDS_EASY, ...WORDS_MEDIUM, ...WORDS_HARD];

    const [word, hint] = pick(words);
    this.currentWord = word;
    this.wordIdx = 0;

    $('#word-hint').textContent = `(${hint})`;
    $('#soundout-feedback').textContent = '';
    $('#soundout-feedback').className = 'feedback';
    this.renderWord();

    setTimeout(() => speak(word), 300);
  },

  renderWord() {
    const container = $('#word-display');
    container.innerHTML = '';
    for (let i = 0; i < this.currentWord.length; i++) {
      const span = document.createElement('span');
      span.className = 'word-letter';
      span.textContent = this.currentWord[i];
      if (i < this.wordIdx) span.classList.add('done');
      else if (i === this.wordIdx) span.classList.add('active');
      container.appendChild(span);
    }
  },

  soundCurrentLetter() {
    if (!this.currentWord || this.wordIdx >= this.currentWord.length) return;
    const letter = this.currentWord[this.wordIdx];
    const sound = LETTER_SOUNDS[letter] || letter;
    speak(sound);
    const fb = $('#soundout-feedback');
    fb.textContent = `"${letter}" låter som "${sound}"`;
    fb.className = 'feedback';
  },

  nextSound() {
    if (!this.currentWord || this.wordIdx >= this.currentWord.length) return;

    const letter = this.currentWord[this.wordIdx];
    this.recordCorrect(letter);
    this.wordIdx++;
    this.renderWord();

    const fb = $('#soundout-feedback');

    if (this.wordIdx >= this.currentWord.length) {
      // Word complete
      fb.textContent = `${pick(ENCOURAGEMENTS)}\nDu ljudade "${this.currentWord}"! 🎉`;
      fb.className = 'feedback success';
      playSuccess();
      confetti();
      setTimeout(() => speak('Fantastiskt! Du klarade det!'), 200);

      // Level up every 20 correct
      if (this.progress.total_correct > 0 && this.progress.total_correct % 20 === 0 && this.progress.level < 3) {
        this.progress.level++;
        saveProgress(this.progress);
        this.showLevelUp();
      }
    } else {
      const next = this.currentWord[this.wordIdx];
      const sound = LETTER_SOUNDS[next] || next;
      fb.textContent = `"${next}" låter som "${sound}"`;
      fb.className = 'feedback';
      setTimeout(() => speak(sound), 100);
    }
  },

  // ── Progress ──
  recordCorrect(letter) {
    const p = this.progress;
    p.total_correct++;
    p.total_attempts++;
    p.streak++;
    p.stars++;
    if (!p.letters_mastered.includes(letter)) p.letters_mastered.push(letter);
    if (p.streak % 5 === 0) { p.stars += 2; confetti(20); }
    saveProgress(p);
    this.updateStats();
  },

  recordWrong() {
    this.progress.total_attempts++;
    this.progress.streak = 0;
    saveProgress(this.progress);
    this.updateStats();
  },

  updateStats() {
    const p = this.progress;
    $('.stat.stars').textContent = `⭐ ${p.stars}`;
    $('.stat.streak').textContent = `🔥 ${p.streak}`;
    $('.stat.level-badge').textContent = `Nivå ${p.level}`;
  },

  updateProgressSummary() {
    const el = $('.progress-summary');
    if (el) {
      const p = this.progress;
      el.textContent = `Bokstäver bemästrade: ${p.letters_mastered.length}/29 | Totalt rätt: ${p.total_correct}`;
    }
  },

  showLevelUp() {
    playLevelUp();
    confetti(60);
    $('#levelup-text').textContent = `🎊 NIVÅ UPP! Du är nu nivå ${this.progress.level}! 🎊`;
    $('#levelup-modal').classList.remove('hidden');
  }
};

// ── Modal button handlers ──────────────────────────────────────────────
document.addEventListener('click', e => {
  if (e.target.id === 'welcome-start') $('#welcome-modal').classList.add('hidden');
  if (e.target.id === 'levelup-ok') $('#levelup-modal').classList.add('hidden');
});

// ── Boot ───────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
