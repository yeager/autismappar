// Bokstavsresan PWA — Swedish/English letter learning game
// © 2026 Daniel Nylander / Autismappar.se
// Matches GTK4 Bokstavsresan v0.1.1 feature set + i18n

'use strict';

// ── i18n system ────────────────────────────────────────────────────────
const TRANSLATIONS = {
  sv: {
    loading_voice: 'Laddar röstmodell…',
    app_title: 'Bokstavsresan',
    welcome_title: 'Välkommen till Bokstavsresan! 🎉',
    welcome_subtitle: 'Välj ditt äventyr! 🗺️',
    explore_label: 'Utforska bokstäver',
    explore_desc: 'Tryck på bokstäver för att höra namn och ljud',
    find_label: 'Hitta bokstaven',
    find_desc: 'Lyssna på ett ljud och hitta rätt bokstav',
    soundout_label: 'Ljuda ord',
    soundout_desc: 'Dela upp ord i enskilda bokstavsljud',
    back: '← Tillbaka',
    explore_title: '🔤 Tryck på en bokstav för att höra den!',
    find_title: '🎯 Lyssna och hitta bokstaven!',
    find_which: '🎯 Vilken bokstav säger',
    replay: '🔊 Spela igen',
    next_letter: 'Nästa bokstav ➡️',
    soundout_title: '📖 Ljuda ordet!',
    sound_current: '🔊 Ljuda denna bokstav',
    next_sound: 'Nästa ljud ➡️',
    new_word: 'Nytt ord 🔄',
    level: 'Nivå',
    welcome_modal_title: 'Välkommen till Bokstavsresan! 🎉',
    welcome_modal_desc: 'Lär dig bokstäver och ljud genom roliga spel!',
    welcome_explore: '🔤 <strong>Utforska</strong> — Tryck på bokstäver för att höra dem',
    welcome_find: '🎯 <strong>Hitta bokstaven</strong> — Lyssna och hitta rätt',
    welcome_soundout: '📖 <strong>Ljuda ord</strong> — Dela upp ord i ljud',
    welcome_stars: 'Du tjänar ⭐ stjärnor för varje rätt svar!<br>Håll din 🔥 streak igång för bonusstjärnor!',
    start_btn: 'Börja! 🚀',
    levelup_ok: 'Toppen! 🎉',
    levelup_text: '🎊 NIVÅ UPP! Du är nu nivå {level}! 🎊',
    progress_summary: 'Bokstäver bemästrade: {mastered}/29 | Totalt rätt: {correct}',
    letter_name: 'Namn',
    letter_sound: 'Ljud',
    letter_feedback: '{letter} — Namn: "{name}", Ljud: "{sound}"',
    sound_feedback: '"{letter}" låter som "{sound}"',
    word_complete: 'Du ljudade "{word}"! 🎉',
    fantastic: 'Fantastiskt! Du klarade det!',
    correct_words: ['Rätt!', 'Ja!', 'Bra!'],
  },
  en: {
    loading_voice: 'Loading voice model…',
    app_title: 'Letter Journey',
    welcome_title: 'Welcome to Letter Journey! 🎉',
    welcome_subtitle: 'Choose your adventure! 🗺️',
    explore_label: 'Explore letters',
    explore_desc: 'Tap letters to hear their names and sounds',
    find_label: 'Find the letter',
    find_desc: 'Listen to a sound and find the right letter',
    soundout_label: 'Sound out words',
    soundout_desc: 'Sound out the letters in a word',
    back: '← Back',
    explore_title: '🔤 Tap a letter to hear it!',
    find_title: '🎯 Listen and find the letter!',
    find_which: '🎯 Which letter says',
    replay: '🔊 Play again',
    next_letter: 'Next letter ➡️',
    soundout_title: '📖 Sound out the word!',
    sound_current: '🔊 Sound this letter',
    next_sound: 'Next sound ➡️',
    new_word: 'New word 🔄',
    level: 'Level',
    welcome_modal_title: 'Welcome to Letter Journey! 🎉',
    welcome_modal_desc: 'Learn letters and sounds through fun games!',
    welcome_explore: '🔤 <strong>Explore</strong> — Tap letters to hear them',
    welcome_find: '🎯 <strong>Find the letter</strong> — Listen and find the right one',
    welcome_soundout: '📖 <strong>Sound out words</strong> — Break words into sounds',
    welcome_stars: 'Earn ⭐ stars for every correct answer!<br>Keep your 🔥 streak going for bonus stars!',
    start_btn: 'Start! 🚀',
    levelup_ok: 'Awesome! 🎉',
    levelup_text: '🎊 LEVEL UP! You are now level {level}! 🎊',
    progress_summary: 'Letters mastered: {mastered}/{total} | Total correct: {correct}',
    letter_name: 'Name',
    letter_sound: 'Sound',
    letter_feedback: '{letter} — Name: "{name}", Sound: "{sound}"',
    sound_feedback: '"{letter}" sounds like "{sound}"',
    word_complete: 'You sounded out "{word}"! 🎉',
    fantastic: 'Fantastic! You did it!',
    correct_words: ['Correct!', 'Yes!', 'Great!'],
  }
};

const ENCOURAGEMENTS_I18N = {
  sv: [
    'Bra jobbat! ⭐','Fantastiskt! 🌟','Du är en stjärna! ✨',
    'Otroligt! 🎉','Bra gjort! 👏','Fortsätt så! 💪',
    'Super! 🚀','Lysande! 🌈','Du klarade det! 🎊',
    'Wow! 🏆','Perfekt! 💯','Mästare! 🥇'
  ],
  en: [
    'Great job! ⭐','Fantastic! 🌟','You are a star! ✨',
    'Incredible! 🎉','Well done! 👏','Keep going! 💪',
    'Super! 🚀','Brilliant! 🌈','You did it! 🎊',
    'Wow! 🏆','Perfect! 💯','Champion! 🥇'
  ]
};

const TRY_AGAIN_I18N = {
  sv: [
    'Nästan! Försök igen! 💪','Så nära! En gång till! 🌟',
    'Du kan det! 🎯','Ge inte upp! 💫'
  ],
  en: [
    'Almost! Try again! 💪','So close! One more time! 🌟',
    'You can do it! 🎯','Don\'t give up! 💫'
  ]
};

// ── Language state ─────────────────────────────────────────────────────
let currentLang = localStorage.getItem('bokstavsresan_lang') || (navigator.language?.startsWith('en') ? 'en' : 'sv');

function t(key, replacements) {
  let str = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.sv[key] || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      str = str.replace(`{${k}}`, v);
    }
  }
  return str;
}

function getEncouragements() { return ENCOURAGEMENTS_I18N[currentLang] || ENCOURAGEMENTS_I18N.sv; }
function getTryAgain() { return TRY_AGAIN_I18N[currentLang] || TRY_AGAIN_I18N.sv; }

// Keep legacy references for minimal code changes
let ENCOURAGEMENTS = getEncouragements();
let TRY_AGAIN = getTryAgain();

// ── Language-aware phonetic data ───────────────────────────────────────
const LETTER_PHONETICS_I18N = {
  sv: {
    A:'ah',B:'beh',C:'seh',D:'deh',E:'eh',F:'eff',G:'geh',H:'hå',
    I:'ih',J:'jih',K:'kå',L:'ell',M:'emm',N:'enn',O:'oh',P:'peh',
    Q:'kuh',R:'err',S:'ess',T:'teh',U:'uh',V:'veh',W:'dubbelveh',
    X:'eks',Y:'yh',Z:'seta',Å:'å',Ä:'äh',Ö:'öh'
  },
  en: {
    A:'ay',B:'bee',C:'see',D:'dee',E:'ee',F:'eff',G:'gee',H:'aitch',
    I:'eye',J:'jay',K:'kay',L:'ell',M:'em',N:'en',O:'oh',P:'pee',
    Q:'cue',R:'ar',S:'ess',T:'tee',U:'you',V:'vee',W:'double-you',
    X:'ex',Y:'why',Z:'zee'
  }
};

const LETTER_SOUNDS_I18N = {
  sv: {
    A:'aaa',B:'bbb',C:'sss',D:'ddd',E:'eee',F:'fff',G:'ggg',H:'hhh',
    I:'iii',J:'jjj',K:'kkk',L:'lll',M:'mmm',N:'nnn',O:'ooo',P:'ppp',
    Q:'kkk',R:'rrr',S:'sss',T:'ttt',U:'uuu',V:'vvv',W:'vvv',
    X:'ks',Y:'yyy',Z:'sss',Å:'ååå',Ä:'äää',Ö:'ööö'
  },
  en: {
    A:'aaa',B:'buh',C:'kuh',D:'duh',E:'eee',F:'fff',G:'guh',H:'hhh',
    I:'iii',J:'juh',K:'kuh',L:'lll',M:'mmm',N:'nnn',O:'ooo',P:'puh',
    Q:'kwuh',R:'rrr',S:'sss',T:'tuh',U:'uuu',V:'vvv',W:'wuh',
    X:'ks',Y:'yuh',Z:'zzz'
  }
};

// Active references (updated on language change)
let LETTER_PHONETICS = LETTER_PHONETICS_I18N[currentLang] || LETTER_PHONETICS_I18N.sv;
let LETTER_SOUNDS = LETTER_SOUNDS_I18N[currentLang] || LETTER_SOUNDS_I18N.sv;
let LETTERS = Object.keys(LETTER_PHONETICS);

// ── Word lists by difficulty (language-aware) ──────────────────────────
const WORDS_I18N = {
  sv: {
    easy: [
      ['SOL','sol'],['KAT','katt'],['HUS','hus'],['BIL','bil'],
      ['MUS','mus'],['HÅR','hår'],['BÅT','båt'],['ÖGA','öga'],
      ['ARM','arm'],['BEN','ben'],['LÅS','lås'],['NÄS','näsa']
    ],
    medium: [
      ['BOLL','boll'],['LAMM','lamm'],['FISK','fisk'],['GRIS','gris'],
      ['HUND','hund'],['KATT','katt'],['STOL','stol'],['DÖRR','dörr'],
      ['BLAD','blad'],['SNÄL','snäll'],['GLAD','glad'],['STOR','stor']
    ],
    hard: [
      ['ÄPPLE','äpple'],['SKOLA','skola'],['BJÖRN','björn'],
      ['BLOMMA','blomma'],['STJÄRNA','stjärna'],['TRÄD','träd'],
      ['SJUNGA','sjunga'],['HIMMEL','himmel'],['VATTEN','vatten']
    ]
  },
  en: {
    easy: [
      ['SUN','sun'],['CAT','cat'],['DOG','dog'],['HAT','hat'],
      ['BIG','big'],['RUN','run'],['CUP','cup'],['BED','bed'],
      ['MAP','map'],['PEN','pen'],['RED','red'],['SIT','sit']
    ],
    medium: [
      ['FISH','fish'],['DUCK','duck'],['HAND','hand'],['TREE','tree'],
      ['FROG','frog'],['LAMP','lamp'],['JUMP','jump'],['STAR','star'],
      ['MILK','milk'],['BOOK','book'],['BLUE','blue'],['SHIP','ship']
    ],
    hard: [
      ['APPLE','apple'],['SCHOOL','school'],['FLOWER','flower'],
      ['GARDEN','garden'],['WINDOW','window'],['RIVER','river'],
      ['CASTLE','castle'],['DRAGON','dragon'],['PLANET','planet']
    ]
  }
};

function getWords(difficulty) {
  return WORDS_I18N[currentLang]?.[difficulty] || WORDS_I18N.sv[difficulty];
}

// ── Helpers ────────────────────────────────────────────────────────────
const $ = s => document.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ── TTS via Piper WASM (primary) with Web Speech API fallback ──────────
const PIPER_VOICES = {
  sv: 'sv_SE-nst-medium',
  en: 'en_US-hfc_female-medium'
};

let piperTTS = null;
let piperReady = false;
let piperFailed = false;
let piperLoading = false;
let piperCurrentVoice = null;
let speakQueue = [];

function getPiperVoiceId() {
  return PIPER_VOICES[currentLang] || PIPER_VOICES.sv;
}

function showTTSLoading(show) {
  let el = document.getElementById('tts-loading');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'tts-loading';
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#764ba2;color:#fff;text-align:center;padding:10px;font-size:14px;';
    el.innerHTML = `🔊 ${t('loading_voice')} <span id="tts-loading-pct"></span>`;
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
    await ensurePiperVoice();
    piperReady = true;
    piperLoading = false;
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

async function ensurePiperVoice() {
  if (!piperTTS) return;
  const voiceId = getPiperVoiceId();
  if (piperCurrentVoice === voiceId) return;
  const stored = await piperTTS.stored();
  if (!stored.includes(voiceId)) {
    showTTSLoading(true);
    await piperTTS.download(voiceId, updateTTSProgress);
    showTTSLoading(false);
  }
  piperCurrentVoice = voiceId;
}

// Web Speech API fallback
let fallbackVoice = null;
function initWebSpeechFallback() {
  if (!('speechSynthesis' in window)) return;
  const loadVoices = () => {
    const langPrefix = currentLang === 'en' ? 'en' : 'sv';
    fallbackVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith(langPrefix)) || null;
  };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function speakWebSpeech(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = currentLang === 'en' ? 'en-US' : 'sv-SE';
  u.rate = 0.8;
  u.pitch = 1.1;
  u.volume = 0.9;
  if (fallbackVoice) u.voice = fallbackVoice;
  speechSynthesis.speak(u);
}

let currentAudio = null;

async function speakPiper(text) {
  try {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    await ensurePiperVoice();
    const wav = await piperTTS.predict({
      text: text,
      voiceId: getPiperVoiceId(),
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
  speakQueue.push(text);
}

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

// ── i18n: apply translations to DOM ────────────────────────────────────
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.dataset.i18nHtml) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });
  // Update html lang
  document.documentElement.lang = currentLang;
  // Update page title
  document.title = currentLang === 'en'
    ? 'Letter Journey — Explore letters and sounds'
    : 'Bokstavsresan — Utforska bokstäver och ljud';
  // Update lang toggle button
  const langBtn = $('#lang-toggle');
  if (langBtn) langBtn.textContent = currentLang === 'sv' ? '🇬🇧' : '🇸🇪';
}

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('bokstavsresan_lang', lang);
  LETTER_PHONETICS = LETTER_PHONETICS_I18N[lang] || LETTER_PHONETICS_I18N.sv;
  LETTER_SOUNDS = LETTER_SOUNDS_I18N[lang] || LETTER_SOUNDS_I18N.sv;
  LETTERS = Object.keys(LETTER_PHONETICS);
  ENCOURAGEMENTS = getEncouragements();
  TRY_AGAIN = getTryAgain();
  // Update Web Speech fallback voice
  if (piperFailed) initWebSpeechFallback();
  applyTranslations();
  // Update dynamic stats
  app.updateStats();
  app.updateProgressSummary();
  // If in a game mode, go back to menu to avoid stale state
  if (app.mode !== 'menu') app.showPage('menu');
}

// ── App ────────────────────────────────────────────────────────────────
const app = {
  progress: loadProgress(),
  mode: 'menu',
  targetLetter: null,
  currentWord: null,
  wordIdx: 0,

  init() {
    applyTranslations();
    this.updateStats();
    this.updateProgressSummary();
    this.bindEvents();
    this.showPage('menu');

    if (!localStorage.getItem('bokstavsresan_visited')) {
      localStorage.setItem('bokstavsresan_visited', '1');
      $('#welcome-modal').classList.remove('hidden');
    }

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

    document.addEventListener('pointerdown', () => {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }, { once: true });

    // Language toggle
    const langBtn = $('#lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        switchLanguage(currentLang === 'sv' ? 'en' : 'sv');
      });
    }
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
    if (action === undefined) {
      const t = event?.target;
      if (t?.id === 'welcome-start') $('#welcome-modal').classList.add('hidden');
      if (t?.id === 'levelup-ok')    $('#levelup-modal').classList.add('hidden');
    }
  },

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
    fb.textContent = t('letter_feedback', { letter, name, sound });
    fb.className = 'feedback success';

    speak(`${letter}. ${name}. ${sound}.`);
    btn.classList.add('correct');
    setTimeout(() => btn.classList.remove('correct'), 500);

    this.recordCorrect(letter);
    playSuccess();
  },

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
    $('#find-title').textContent = `${t('find_which')} "${phonetic}"?`;
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
      const correctWords = TRANSLATIONS[currentLang]?.correct_words || TRANSLATIONS.sv.correct_words;
      setTimeout(() => speak(pick(correctWords)), 200);
    } else {
      fb.textContent = pick(TRY_AGAIN);
      fb.className = 'feedback error';
      btn.classList.add('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 800);
      this.recordWrong();
      playError();
    }
  },

  startSoundoutRound() {
    const lvl = this.progress.level;
    let words = getWords('easy');
    if (lvl >= 2) words = [...getWords('easy'), ...getWords('medium')];
    if (lvl >= 3) words = [...getWords('easy'), ...getWords('medium'), ...getWords('hard')];

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
    fb.textContent = t('sound_feedback', { letter, sound });
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
      fb.textContent = `${pick(ENCOURAGEMENTS)}\n${t('word_complete', { word: this.currentWord })}`;
      fb.className = 'feedback success';
      playSuccess();
      confetti();
      setTimeout(() => speak(t('fantastic')), 200);

      if (this.progress.total_correct > 0 && this.progress.total_correct % 20 === 0 && this.progress.level < 3) {
        this.progress.level++;
        saveProgress(this.progress);
        this.showLevelUp();
      }
    } else {
      const next = this.currentWord[this.wordIdx];
      const sound = LETTER_SOUNDS[next] || next;
      fb.textContent = t('sound_feedback', { letter: next, sound });
      fb.className = 'feedback';
      setTimeout(() => speak(sound), 100);
    }
  },

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
    $('.stat.level-badge').textContent = `${t('level')} ${p.level}`;
  },

  updateProgressSummary() {
    const el = $('.progress-summary');
    if (el) {
      const p = this.progress;
      el.textContent = t('progress_summary', {
        mastered: p.letters_mastered.length,
        total: LETTERS.length,
        correct: p.total_correct
      });
    }
  },

  showLevelUp() {
    playLevelUp();
    confetti(60);
    $('#levelup-text').textContent = t('levelup_text', { level: this.progress.level });
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
