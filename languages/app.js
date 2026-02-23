// Translation Hall of Fame - App.js
// Autismappar.se language progress tracker

class TranslationHallOfFame {
    constructor() {
        this.languages = {
            'sv': { name: 'Svenska', flag: '🇸🇪', country: 'sweden' },
            'da': { name: 'Dansk', flag: '🇩🇰', country: 'denmark' },
            'de': { name: 'Deutsch', flag: '🇩🇪', country: 'germany' },
            'es': { name: 'Español', flag: '🇪🇸', country: 'spain' },
            'fi': { name: 'Suomi', flag: '🇫🇮', country: 'finland' },
            'fr': { name: 'Français', flag: '🇫🇷', country: 'france' },
            'it': { name: 'Italiano', flag: '🇮🇹', country: 'italy' },
            'nb_NO': { name: 'Norsk', flag: '🇳🇴', country: 'norway' },
            'nl': { name: 'Nederlands', flag: '🇳🇱', country: 'netherlands' },
            'pl': { name: 'Polski', flag: '🇵🇱', country: 'poland' },
            'pt_BR': { name: 'Português (Brasil)', flag: '🇧🇷', country: 'brazil' }
        };
        
        this.stats = null;
        this.init();
    }

    async init() {
        await this.loadStats();
        this.renderWorldMap();
        this.renderLanguageProgress();
        this.renderBadges();
        this.updateOverviewStats();
        this.startAutoRefresh();
    }

    async loadStats() {
        try {
            const response = await fetch('stats.json');
            this.stats = await response.json();
            
            // Update last updated timestamp
            const lastUpdated = document.getElementById('last-updated');
            if (lastUpdated && this.stats.lastUpdated) {
                const date = new Date(this.stats.lastUpdated);
                lastUpdated.textContent = date.toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (error) {
            console.error('Failed to load translation stats:', error);
            this.showLoadingError();
        }
    }

    showLoadingError() {
        const container = document.getElementById('languages-grid');
        container.innerHTML = `
            <div class="loading">
                <h3>⚠️ Kunde inte läsa in statistik</h3>
                <p>Översättningsstatistiken uppdateras för närvarande. Försök igen om en stund.</p>
                <button onclick="location.reload()" class="btn-primary">Uppdatera sidan</button>
            </div>
        `;
    }

    renderWorldMap() {
        const mapContainer = document.getElementById('world-map');
        
        // Simplified SVG world map with target countries highlighted
        const worldMapSVG = `
            <svg class="world-map-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <style>
                        .country { fill: #e0e0e0; stroke: #ccc; stroke-width: 0.5; transition: all 0.3s ease; }
                        .target-language { fill: #ff9800; stroke: #f57c00; }
                        .complete { fill: #4caf50; stroke: #388e3c; animation: pulse 2s infinite; }
                        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
                    </style>
                </defs>
                
                <!-- Simplified country shapes -->
                <!-- Sweden -->
                <path id="sweden" class="country target-language" d="M520 80 L540 75 L545 95 L535 120 L525 115 L515 95 Z" data-country="sweden" data-language="sv"/>
                
                <!-- Denmark -->
                <path id="denmark" class="country target-language" d="M515 120 L525 115 L530 125 L520 130 L510 125 Z" data-country="denmark" data-language="da"/>
                
                <!-- Norway -->
                <path id="norway" class="country target-language" d="M510 60 L530 55 L540 75 L520 80 L505 75 Z" data-country="norway" data-language="nb_NO"/>
                
                <!-- Finland -->
                <path id="finland" class="country target-language" d="M545 70 L565 65 L570 90 L560 110 L545 95 Z" data-country="finland" data-language="fi"/>
                
                <!-- Germany -->
                <path id="germany" class="country target-language" d="M500 130 L530 125 L540 150 L520 160 L495 155 Z" data-country="germany" data-language="de"/>
                
                <!-- Netherlands -->
                <path id="netherlands" class="country target-language" d="M490 125 L510 120 L515 135 L500 140 L485 135 Z" data-country="netherlands" data-language="nl"/>
                
                <!-- France -->
                <path id="france" class="country target-language" d="M470 150 L500 145 L510 180 L480 185 L460 170 Z" data-country="france" data-language="fr"/>
                
                <!-- Spain -->
                <path id="spain" class="country target-language" d="M440 180 L480 175 L485 210 L450 215 L430 195 Z" data-country="spain" data-language="es"/>
                
                <!-- Italy -->
                <path id="italy" class="country target-language" d="M520 170 L540 165 L550 210 L535 220 L525 195 Z" data-country="italy" data-language="it"/>
                
                <!-- Poland -->
                <path id="poland" class="country target-language" d="M540 130 L570 125 L580 155 L560 165 L535 160 Z" data-country="poland" data-language="pl"/>
                
                <!-- Brazil -->
                <path id="brazil" class="country target-language" d="M250 250 L320 240 L350 320 L280 350 L220 310 Z" data-country="brazil" data-language="pt_BR"/>
                
                <!-- Background continents (simplified) -->
                <path class="country" d="M100 100 L400 90 L450 200 L400 300 L150 320 L80 250 Z"/>
                <path class="country" d="M600 120 L800 110 L850 200 L780 280 L650 290 L580 220 Z"/>
                <path class="country" d="M200 350 L400 340 L450 450 L350 480 L180 470 Z"/>
                <path class="country" d="M500 350 L700 340 L750 450 L650 480 L480 470 Z"/>
            </svg>
        `;
        
        mapContainer.innerHTML = worldMapSVG;
        
        // Add click handlers and update based on completion status
        if (this.stats && this.stats.languages) {
            Object.keys(this.languages).forEach(langCode => {
                const country = this.languages[langCode].country;
                const countryElement = document.getElementById(country);
                const langStats = this.stats.languages[langCode];
                
                if (countryElement && langStats) {
                    // Mark as complete if 100%
                    if (langStats.percentage >= 100) {
                        countryElement.classList.add('complete');
                        countryElement.classList.remove('target-language');
                    }
                    
                    // Add tooltip and click handler
                    countryElement.setAttribute('title', 
                        `${this.languages[langCode].name}: ${langStats.percentage}% (${langStats.translated}/${langStats.total})`);
                    
                    countryElement.addEventListener('click', () => {
                        this.scrollToLanguage(langCode);
                    });
                }
            });
        }
    }

    renderLanguageProgress() {
        const container = document.getElementById('languages-grid');
        
        if (!this.stats || !this.stats.languages) {
            container.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Läser in översättningsstatistik...</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        // Sort languages by percentage (descending)
        const sortedLanguages = Object.keys(this.languages).sort((a, b) => {
            const statsA = this.stats.languages[a] || { percentage: 0 };
            const statsB = this.stats.languages[b] || { percentage: 0 };
            return statsB.percentage - statsA.percentage;
        });
        
        sortedLanguages.forEach(langCode => {
            const langInfo = this.languages[langCode];
            const stats = this.stats.languages[langCode] || { total: 0, translated: 0, percentage: 0 };
            
            const card = document.createElement('div');
            card.className = 'language-card';
            card.id = `language-${langCode}`;
            
            const isComplete = stats.percentage >= 100;
            const progressClass = isComplete ? 'complete' : '';
            const percentageClass = isComplete ? 'complete' : '';
            
            card.innerHTML = `
                <div class="language-header">
                    <div class="language-flag">${langInfo.flag}</div>
                    <div class="language-info">
                        <h3>${langInfo.name}</h3>
                        <div class="language-code">${langCode}</div>
                    </div>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${stats.percentage}%"></div>
                    </div>
                    
                    <div class="progress-stats">
                        <span>${stats.translated.toLocaleString()} / ${stats.total.toLocaleString()} strängar</span>
                        <span class="percentage ${percentageClass}">${stats.percentage}%</span>
                    </div>
                </div>
                
                ${isComplete ? '<div class="achievement">🏆 Språket är färdigt!</div>' : ''}
            `;
            
            container.appendChild(card);
        });
    }

    renderBadges() {
        const container = document.getElementById('badges-container');
        const milestones = [
            { threshold: 25, icon: '🥉', title: 'Brons', description: '25% översatt' },
            { threshold: 50, icon: '🥈', title: 'Silver', description: '50% översatt' },
            { threshold: 75, icon: '🥇', title: 'Guld', description: '75% översatt' },
            { threshold: 100, icon: '🏆', title: 'Mästare', description: '100% färdig!' }
        ];
        
        container.innerHTML = '';
        
        if (!this.stats || !this.stats.languages) return;
        
        milestones.forEach(milestone => {
            const languagesAtMilestone = Object.keys(this.languages).filter(langCode => {
                const stats = this.stats.languages[langCode];
                return stats && stats.percentage >= milestone.threshold;
            });
            
            const badge = document.createElement('div');
            badge.className = `milestone-badge ${languagesAtMilestone.length > 0 ? 'earned' : ''}`;
            
            badge.innerHTML = `
                <div class="badge-icon">${milestone.icon}</div>
                <div class="badge-title">${milestone.title}</div>
                <div class="badge-description">
                    ${milestone.description}
                    <br>
                    <strong>${languagesAtMilestone.length} språk</strong>
                </div>
            `;
            
            container.appendChild(badge);
        });
    }

    updateOverviewStats() {
        if (!this.stats || !this.stats.languages) return;
        
        const totalLanguages = Object.keys(this.languages).length;
        const completedLanguages = Object.values(this.stats.languages).filter(stats => stats.percentage >= 100).length;
        const totalStrings = Object.values(this.stats.languages).reduce((sum, stats) => sum + (stats.total || 0), 0);
        
        document.getElementById('total-languages').textContent = totalLanguages;
        document.getElementById('completed-languages').textContent = completedLanguages;
        document.getElementById('total-strings').textContent = totalStrings.toLocaleString();
        
        // Add animation to numbers
        this.animateNumber('total-languages', totalLanguages);
        this.animateNumber('completed-languages', completedLanguages);
        this.animateNumber('total-strings', totalStrings);
    }

    animateNumber(elementId, finalValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = 0;
        const duration = 2000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
            element.textContent = elementId === 'total-strings' ? currentValue.toLocaleString() : currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    scrollToLanguage(langCode) {
        const element = document.getElementById(`language-${langCode}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = '';
            }, 1000);
        }
    }

    startAutoRefresh() {
        // Refresh every 30 minutes
        setInterval(() => {
            this.loadStats();
        }, 30 * 60 * 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TranslationHallOfFame();
});

// Add some fun Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const userInput = window.userInput || [];
    
    userInput.push(e.keyCode);
    window.userInput = userInput.slice(-konamiCode.length);
    
    if (window.userInput.join(',') === konamiCode.join(',')) {
        // Trigger celebration animation
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for Easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);