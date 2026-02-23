// Bokstavsresan PWA - Swedish letter learning game for children with dyspraxia
// © 2026 Autismappar.se - Accessible design for children with disabilities

// Swedish phonetic data (from GTK source)
const LETTER_PHONETICS = {
    "A": "ah", "B": "beh", "C": "seh", "D": "deh", "E": "eh",
    "F": "eff", "G": "geh", "H": "hå", "I": "ih", "J": "jih",
    "K": "kå", "L": "ell", "M": "emm", "N": "enn", "O": "oh",
    "P": "peh", "Q": "kuh", "R": "err", "S": "ess", "T": "teh",
    "U": "uh", "V": "veh", "W": "dubbelveh", "X": "eks", "Y": "yh",
    "Z": "seta", "Å": "å", "Ä": "äh", "Ö": "öh"
};

// Short phonetic sounds (how letters sound in words)
const LETTER_SOUNDS = {
    "A": "a", "B": "b", "C": "s", "D": "d", "E": "e",
    "F": "f", "G": "g", "H": "h", "I": "i", "J": "j",
    "K": "k", "L": "l", "M": "m", "N": "n", "O": "o",
    "P": "p", "Q": "k", "R": "r", "S": "s", "T": "t",
    "U": "u", "V": "v", "W": "v", "X": "ks", "Y": "y",
    "Z": "s", "Å": "å", "Ä": "ä", "Ö": "ö"
};

// Swedish word lists by difficulty
const WORDS_EASY = [
    ["SOL", "sol"], ["KAT", "katt"], ["HUS", "hus"],
    ["BIL", "bil"], ["MUS", "mus"], ["HÅR", "hår"],
    ["BÅT", "båt"], ["ÖGA", "öga"], ["ARM", "arm"],
    ["BEN", "ben"], ["LÅS", "lås"], ["NÄS", "näsa"]
];

const WORDS_MEDIUM = [
    ["BOLL", "boll"], ["LAMM", "lamm"], ["FISK", "fisk"],
    ["GRIS", "gris"], ["HUND", "hund"], ["KATT", "katt"],
    ["STOL", "stol"], ["DÖRR", "dörr"], ["BLAD", "blad"],
    ["SNÄL", "snäll"], ["GLAD", "glad"], ["STOR", "stor"]
];

const WORDS_HARD = [
    ["ÄPPLE", "äpple"], ["SKOLA", "skola"], ["BJÖRN", "björn"],
    ["BLOMMA", "blomma"], ["STJÄRNA", "stjärna"], ["TRÄD", "träd"],
    ["SJUNGA", "sjunga"], ["HIMMEL", "himmel"], ["VATTEN", "vatten"]
];

// Encouragement messages
const ENCOURAGEMENTS_SV = [
    "Bra jobbat! ⭐", "Fantastiskt! 🌟", "Du är en stjärna! ✨",
    "Fantastiskt! 🎉", "Bra gjort! 👏", "Fortsätt så! 💪",
    "Super! 🚀", "Lysande! 🌈", "Du klarade det! 🎊",
    "Wow, otroligt! 🏆", "Perfekt! 💯", "Mästare! 🥇"
];

const ENCOURAGEMENTS_EN = [
    "Great job! ⭐", "Fantastic! 🌟", "You're a star! ✨",
    "Amazing! 🎉", "Well done! 👏", "Keep going! 💪",
    "Super! 🚀", "Brilliant! 🌈", "You did it! 🎊",
    "Wow, incredible! 🏆", "Perfect! 💯", "Champion! 🥇"
];

const TRY_AGAIN_SV = [
    "Nästan! Försök igen! 💪", "Så nära! En gång till! 🌟",
    "Du kan det! 🎯", "Ge inte upp! Fortsätt försöka! 💫"
];

const TRY_AGAIN_EN = [
    "Almost! Try again! 💪", "So close! One more time! 🌟",
    "You can do it! 🎯", "Don't give up! Keep trying! 💫"
];

// Language support
const TRANSLATIONS = {
    sv: {
        appTitle: "Bokstavsresan",
        welcomeTitle: "Välkommen till Bokstavsresan! 🎉",
        welcomeSubtitle: "Välj ditt äventyr! 🗺️",
        exploreTitle: "🔤 Utforska bokstäver",
        exploreDesc: "Tryck på bokstäver för att höra namn och ljud",
        findTitle: "🎯 Hitta bokstaven",
        findDesc: "Lyssna på ett ljud och hitta rätt bokstav",
        soundoutTitle: "📖 Ljuda ord",
        soundoutDesc: "Dela upp ord i enskilda bokstavsljud",
        level: "Nivå",
        lettersMastered: "Bokstäver bemästrade",
        totalCorrect: "Totalt rätt",
        back: "← Tillbaka",
        playAgain: "🔊 Spela igen",
        nextLetter: "Nästa bokstav ➡️",
        soundLetter: "🔊 Ljuda denna bokstav",
        nextSound: "Nästa ljud ➡️",
        newWord: "Nytt ord 🔄",
        tapLetterHint: "🔤 Tryck på en bokstav för att höra den!",
        findLetterHint: "🎯 Lyssna och hitta bokstaven!",
        whichLetterSays: "🎯 Vilken bokstav säger '{sound}'?",
        soundOutHint: "📖 Ljuda ordet!",
        letterSoundsLike: "'{letter}' låter som '{sound}'",
        wordComplete: "Du ljudade '{word}'! 🎉",
        levelUp: "🎊 NIVÅ UPP! Du är nu nivå {level}! 🎊",
        amazing: "Fantastiskt! Du klarade det!"
    },
    en: {
        appTitle: "Letter Journey",
        welcomeTitle: "Welcome to Letter Journey! 🎉",
        welcomeSubtitle: "Choose your adventure! 🗺️",
        exploreTitle: "🔤 Explore Letters",
        exploreDesc: "Tap letters to hear their name and sound",
        findTitle: "🎯 Find the Letter",
        findDesc: "Listen to a sound and find the right letter",
        soundoutTitle: "📖 Sound Out Words",
        soundoutDesc: "Break words into individual letter sounds",
        level: "Level",
        lettersMastered: "Letters mastered",
        totalCorrect: "Total correct",
        back: "← Back",
        playAgain: "🔊 Play again",
        nextLetter: "Next letter ➡️",
        soundLetter: "🔊 Sound this letter",
        nextSound: "Next sound ➡️",
        newWord: "New word 🔄",
        tapLetterHint: "🔤 Tap a letter to hear it!",
        findLetterHint: "🎯 Listen and find the letter!",
        whichLetterSays: "🎯 Which letter says '{sound}'?",
        soundOutHint: "📖 Sound out the word!",
        letterSoundsLike: "'{letter}' sounds like '{sound}'",
        wordComplete: "You sounded out '{word}'! 🎉",
        levelUp: "🎊 LEVEL UP! You're now level {level}! 🎊",
        amazing: "Amazing! You did it!"
    }
};

// Main App class
class BokstavsresanApp {
    constructor() {
        this.currentLang = 'sv'; // Default to Swedish
        this.currentMode = 'menu';
        this.progress = this.loadProgress();
        this.targetLetter = null;
        this.currentWord = null;
        this.currentWordIndex = 0;
        this.gameButtons = [];
        
        // Audio context for sound effects
        this.audioContext = null;
        this.setupAudio();
        
        // Initialize app
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.setupElements();
        this.setupEventListeners();
        this.updateStats();
        this.showPage('menu');
        
        // Check for first time visit
        if (!localStorage.getItem('bokstavsresan_visited')) {
            localStorage.setItem('bokstavsresan_visited', 'true');
            this.showWelcomeMessage();
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => console.log('SW registered'))
                .catch(error => console.log('SW registration failed'));
        }
    }

    setupAudio() {
        // Initialize Web Audio for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.log('Web Audio not supported');
        }
    }

    setupElements() {
        // Cache frequently used elements
        this.elements = {
            appTitle: document.querySelector('.app-title'),
            langToggle: document.querySelector('.lang-toggle'),
            statsStars: document.querySelector('.stats-stars'),
            statsStreak: document.querySelector('.stats-streak'),
            statsLevel: document.querySelector('.stats-level'),
            pages: {
                menu: document.getElementById('menu-page'),
                explore: document.getElementById('explore-page'),
                find: document.getElementById('find-page'),
                soundout: document.getElementById('soundout-page')
            },
            feedback: {
                explore: document.querySelector('#explore-page .feedback'),
                find: document.querySelector('#find-page .feedback'),
                soundout: document.querySelector('#soundout-page .feedback')
            }
        };

        this.updateLanguage();
    }

    setupEventListeners() {
        // Language toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.lang-toggle')) {
                this.toggleLanguage();
            }
            
            // Mode selection buttons
            if (e.target.matches('.mode-btn')) {
                const mode = e.target.dataset.mode;
                this.startMode(mode);
            }
            
            // Back buttons
            if (e.target.matches('.back-btn')) {
                this.showPage('menu');
            }
            
            // Letter buttons
            if (e.target.matches('.letter-btn')) {
                this.handleLetterClick(e.target);
            }
            
            // Action buttons
            if (e.target.matches('.action-btn')) {
                const action = e.target.dataset.action;
                this.handleAction(action);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showPage('menu');
            }
        });

        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'sv' ? 'en' : 'sv';
        this.updateLanguage();
        localStorage.setItem('bokstavsresan_lang', this.currentLang);
    }

    updateLanguage() {
        const t = TRANSLATIONS[this.currentLang];
        
        // Update static text
        if (this.elements.appTitle) {
            this.elements.appTitle.textContent = t.appTitle;
        }
        
        const langToggle = document.querySelector('.lang-toggle');
        if (langToggle) {
            langToggle.textContent = this.currentLang === 'sv' ? '🇬🇧 EN' : '🇸🇪 SV';
        }

        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) {
                if (el.tagName === 'INPUT' && el.type === 'button') {
                    el.value = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Update page content dynamically
        this.updateMenuPage();
    }

    updateMenuPage() {
        const t = TRANSLATIONS[this.currentLang];
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');
        const progressSummary = document.querySelector('.progress-summary');
        
        if (welcomeTitle) welcomeTitle.textContent = t.welcomeTitle;
        if (welcomeSubtitle) welcomeSubtitle.textContent = t.welcomeSubtitle;
        
        if (progressSummary) {
            const mastered = this.progress.letters_mastered.length;
            const correct = this.progress.total_correct;
            progressSummary.textContent = `${t.lettersMastered}: ${mastered}/29 | ${t.totalCorrect}: ${correct}`;
        }
    }

    showWelcomeMessage() {
        const t = TRANSLATIONS[this.currentLang];
        
        // Simple welcome alert for first-time users
        setTimeout(() => {
            alert(t.welcomeTitle + '\n\n' +
                  '🔤 ' + t.exploreDesc + '\n' +
                  '🎯 ' + t.findDesc + '\n' +
                  '📖 ' + t.soundoutDesc + '\n\n' +
                  'Du tjänar ⭐ stjärnor för varje rätt svar!\n' +
                  'Håll din 🔥 streak igång för bonusstjärnor!');
        }, 1000);
    }

    loadProgress() {
        const saved = localStorage.getItem('bokstavsresan_progress');
        const defaultProgress = {
            letters_mastered: [],
            streak: 0,
            total_correct: 0,
            total_attempts: 0,
            stars: 0,
            level: 1
        };
        
        if (saved) {
            return { ...defaultProgress, ...JSON.parse(saved) };
        }
        return defaultProgress;
    }

    saveProgress() {
        localStorage.setItem('bokstavsresan_progress', JSON.stringify(this.progress));
    }

    recordCorrect(letter) {
        this.progress.total_correct++;
        this.progress.total_attempts++;
        this.progress.streak++;
        this.progress.stars++;
        
        if (!this.progress.letters_mastered.includes(letter)) {
            this.progress.letters_mastered.push(letter);
        }
        
        // Bonus stars for streak milestones
        if (this.progress.streak % 5 === 0) {
            this.progress.stars += 2;
            this.showBonusEffect();
        }
        
        // Level up check
        if (this.progress.total_correct > 0 && this.progress.total_correct % 20 === 0) {
            this.progress.level = Math.min(this.progress.level + 1, 3);
            this.showLevelUp();
        }
        
        this.saveProgress();
        this.updateStats();
    }

    recordWrong() {
        this.progress.total_attempts++;
        this.progress.streak = 0;
        this.saveProgress();
        this.updateStats();
    }

    updateStats() {
        const statsStars = document.querySelector('.stats-stars');
        const statsStreak = document.querySelector('.stats-streak');
        const statsLevel = document.querySelector('.stats-level');
        
        if (statsStars) statsStars.textContent = `⭐ ${this.progress.stars}`;
        if (statsStreak) statsStreak.textContent = `🔥 ${this.progress.streak}`;
        if (statsLevel) {
            const t = TRANSLATIONS[this.currentLang];
            statsLevel.textContent = `${t.level} ${this.progress.level}`;
        }
    }

    showBonusEffect() {
        this.createConfetti();
        this.playSuccessSound();
    }

    showLevelUp() {
        const t = TRANSLATIONS[this.currentLang];
        const message = t.levelUp.replace('{level}', this.progress.level);
        
        // Create level up notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            font-size: 1.8rem;
            font-weight: bold;
            text-align: center;
            z-index: 1000;
            animation: levelUpBounce 2s ease-out forwards;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        this.createConfetti();
        this.playLevelUpSound();
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    createConfetti() {
        // Simple confetti effect
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                z-index: 999;
                border-radius: 2px;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Text-to-Speech functions
    speak(text, lang = 'sv-SE') {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.8; // Slower for children
            utterance.pitch = 1.1; // Slightly higher pitch
            utterance.volume = 0.9;
            
            // Try to find a Swedish voice
            const voices = speechSynthesis.getVoices();
            const swedishVoice = voices.find(voice => voice.lang.startsWith('sv'));
            if (swedishVoice) {
                utterance.voice = swedishVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }

    // Sound effects using Web Audio API
    playSuccessSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Happy success tone sequence
        const frequencies = [523, 659, 784]; // C, E, G
        let time = this.audioContext.currentTime;
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, time + i * 0.15);
            gain.gain.setValueAtTime(0.3, time + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.15 + 0.3);
            
            osc.start(time + i * 0.15);
            osc.stop(time + i * 0.15 + 0.3);
        });
    }

    playErrorSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playLevelUpSound() {
        if (!this.audioContext) return;
        
        // Triumphant fanfare
        const frequencies = [523, 659, 784, 1047]; // C, E, G, C
        let time = this.audioContext.currentTime;
        
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, time + i * 0.2);
            gain.gain.setValueAtTime(0.4, time + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.2 + 0.5);
            
            osc.start(time + i * 0.2);
            osc.stop(time + i * 0.2 + 0.5);
        });
    }

    // Page navigation
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const page = document.getElementById(pageName + '-page');
        if (page) {
            page.classList.add('active');
            this.currentMode = pageName;
        }
    }

    // Game mode handlers
    startMode(mode) {
        this.currentMode = mode;
        this.showPage(mode);
        
        switch(mode) {
            case 'explore':
                this.setupExplorePage();
                break;
            case 'find':
                this.setupFindPage();
                this.startFindRound();
                break;
            case 'soundout':
                this.setupSoundoutPage();
                this.startSoundoutRound();
                break;
        }
    }

    setupExplorePage() {
        const letterGrid = document.querySelector('#explore-page .letter-grid');
        letterGrid.innerHTML = '';
        
        const letters = Object.keys(LETTER_PHONETICS);
        letters.forEach((letter, index) => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;
            letterGrid.appendChild(button);
        });
        
        const t = TRANSLATIONS[this.currentLang];
        const feedback = document.querySelector('#explore-page .feedback');
        feedback.textContent = t.tapLetterHint;
    }

    setupFindPage() {
        const t = TRANSLATIONS[this.currentLang];
        const gameTitle = document.querySelector('#find-page .game-title');
        gameTitle.textContent = t.findLetterHint;
    }

    setupSoundoutPage() {
        const t = TRANSLATIONS[this.currentLang];
        const gameTitle = document.querySelector('#soundout-page .game-title');
        gameTitle.textContent = t.soundOutHint;
    }

    handleLetterClick(button) {
        const letter = button.dataset.letter;
        
        switch(this.currentMode) {
            case 'explore':
                this.handleExploreLetter(letter, button);
                break;
            case 'find':
                this.handleFindLetter(letter, button);
                break;
        }
    }

    handleExploreLetter(letter, button) {
        const t = TRANSLATIONS[this.currentLang];
        const phonetic = LETTER_PHONETICS[letter];
        const sound = LETTER_SOUNDS[letter];
        
        // Update feedback
        const feedback = document.querySelector('#explore-page .feedback');
        feedback.textContent = t.letterSoundsLike.replace('{letter}', letter).replace('{sound}', sound);
        feedback.className = 'feedback success';
        
        // Speak the letter
        this.speak(`${letter}. ${phonetic}. ${sound}.`);
        
        // Visual feedback
        button.classList.add('correct');
        setTimeout(() => button.classList.remove('correct'), 600);
        
        // Record progress
        this.recordCorrect(letter);
        this.playSuccessSound();
    }

    startFindRound() {
        const t = TRANSLATIONS[this.currentLang];
        const feedback = document.querySelector('#find-page .feedback');
        feedback.textContent = '';
        feedback.className = 'feedback';
        
        // Hide next button
        const nextBtn = document.querySelector('#find-page [data-action="next-find"]');
        if (nextBtn) nextBtn.style.display = 'none';
        
        // Pick target letter and distractors
        const letters = Object.keys(LETTER_PHONETICS);
        this.targetLetter = letters[Math.floor(Math.random() * letters.length)];
        
        const choices = [this.targetLetter];
        const distractors = letters.filter(l => l !== this.targetLetter);
        const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
        choices.push(...shuffledDistractors.slice(0, 5));
        choices.sort(() => 0.5 - Math.random());
        
        // Create letter grid
        const letterGrid = document.querySelector('#find-page .letter-grid');
        letterGrid.innerHTML = '';
        
        choices.forEach((letter, index) => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;
            letterGrid.appendChild(button);
        });
        
        // Update instruction
        const gameTitle = document.querySelector('#find-page .game-title');
        const phonetic = LETTER_PHONETICS[this.targetLetter];
        gameTitle.textContent = t.whichLetterSays.replace('{sound}', phonetic);
        
        // Speak the target sound after short delay
        setTimeout(() => {
            this.speak(phonetic);
        }, 1000);
    }

    handleFindLetter(letter, button) {
        const t = TRANSLATIONS[this.currentLang];
        const feedback = document.querySelector('#find-page .feedback');
        const encouragements = this.currentLang === 'sv' ? ENCOURAGEMENTS_SV : ENCOURAGEMENTS_EN;
        const tryAgain = this.currentLang === 'sv' ? TRY_AGAIN_SV : TRY_AGAIN_EN;
        
        if (letter === this.targetLetter) {
            // Correct answer
            feedback.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
            feedback.className = 'feedback success';
            
            button.classList.add('correct');
            this.recordCorrect(letter);
            this.playSuccessSound();
            
            // Show next button
            const nextBtn = document.querySelector('#find-page [data-action="next-find"]');
            if (nextBtn) nextBtn.style.display = 'block';
            
            // Speak encouragement
            setTimeout(() => {
                const praise = ['Rätt!', 'Ja!', 'Bra!'][Math.floor(Math.random() * 3)];
                this.speak(praise);
            }, 200);
            
        } else {
            // Wrong answer
            feedback.textContent = tryAgain[Math.floor(Math.random() * tryAgain.length)];
            feedback.className = 'feedback error';
            
            button.classList.add('wrong');
            setTimeout(() => button.classList.remove('wrong'), 1000);
            
            this.recordWrong();
            this.playErrorSound();
        }
    }

    startSoundoutRound() {
        const t = TRANSLATIONS[this.currentLang];
        const feedback = document.querySelector('#soundout-page .feedback');
        feedback.textContent = '';
        feedback.className = 'feedback';
        
        // Select words based on level
        let wordList = WORDS_EASY;
        if (this.progress.level >= 2) {
            wordList = [...WORDS_EASY, ...WORDS_MEDIUM];
        }
        if (this.progress.level >= 3) {
            wordList = [...WORDS_EASY, ...WORDS_MEDIUM, ...WORDS_HARD];
        }
        
        const [word, hint] = wordList[Math.floor(Math.random() * wordList.length)];
        this.currentWord = word;
        this.currentWordIndex = 0;
        
        // Update word display
        this.updateWordDisplay();
        
        // Show hint
        const wordHint = document.querySelector('#soundout-page .word-hint');
        if (wordHint) wordHint.textContent = `(${hint})`;
        
        // Speak the whole word first
        setTimeout(() => {
            this.speak(word);
        }, 300);
    }

    updateWordDisplay() {
        const wordContainer = document.querySelector('#soundout-page .word-display');
        wordContainer.innerHTML = '';
        
        for (let i = 0; i < this.currentWord.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'word-letter';
            letterSpan.textContent = this.currentWord[i];
            
            if (i < this.currentWordIndex) {
                letterSpan.classList.add('done');
            } else if (i === this.currentWordIndex) {
                letterSpan.classList.add('active');
            }
            
            wordContainer.appendChild(letterSpan);
        }
    }

    handleAction(action) {
        switch(action) {
            case 'replay-find':
                if (this.targetLetter) {
                    this.speak(LETTER_PHONETICS[this.targetLetter]);
                }
                break;
            case 'next-find':
                this.startFindRound();
                break;
            case 'sound-current':
                this.soundCurrentLetter();
                break;
            case 'next-sound':
                this.nextSound();
                break;
            case 'new-word':
                this.startSoundoutRound();
                break;
        }
    }

    soundCurrentLetter() {
        if (this.currentWord && this.currentWordIndex < this.currentWord.length) {
            const letter = this.currentWord[this.currentWordIndex];
            const sound = LETTER_SOUNDS[letter];
            
            const t = TRANSLATIONS[this.currentLang];
            const feedback = document.querySelector('#soundout-page .feedback');
            feedback.textContent = t.letterSoundsLike.replace('{letter}', letter).replace('{sound}', sound);
            feedback.className = 'feedback';
            
            this.speak(sound);
        }
    }

    nextSound() {
        if (!this.currentWord || this.currentWordIndex >= this.currentWord.length) return;
        
        const letter = this.currentWord[this.currentWordIndex];
        this.recordCorrect(letter);
        this.currentWordIndex++;
        this.updateWordDisplay();
        
        const t = TRANSLATIONS[this.currentLang];
        
        if (this.currentWordIndex >= this.currentWord.length) {
            // Word complete!
            const feedback = document.querySelector('#soundout-page .feedback');
            const encouragements = this.currentLang === 'sv' ? ENCOURAGEMENTS_SV : ENCOURAGEMENTS_EN;
            const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            const completeMsg = t.wordComplete.replace('{word}', this.currentWord);
            feedback.textContent = encouragement + '\n' + completeMsg;
            feedback.className = 'feedback success';
            
            this.playSuccessSound();
            setTimeout(() => {
                this.speak(t.amazing);
            }, 200);
            
        } else {
            // Sound next letter
            const nextLetter = this.currentWord[this.currentWordIndex];
            const nextSound = LETTER_SOUNDS[nextLetter];
            
            const feedback = document.querySelector('#soundout-page .feedback');
            feedback.textContent = t.letterSoundsLike.replace('{letter}', nextLetter).replace('{sound}', nextSound);
            feedback.className = 'feedback';
            
            setTimeout(() => {
                this.speak(nextSound);
            }, 100);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
    
    @keyframes levelUpBounce {
        0% {
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bokstavsresanApp = new BokstavsresanApp();
    });
} else {
    window.bokstavsresanApp = new BokstavsresanApp();
}