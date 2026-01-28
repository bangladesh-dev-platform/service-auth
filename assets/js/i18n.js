/**
 * Internationalization (i18n) Handler
 * Manages language switching and text translation
 */

class I18n {
    constructor() {
        this.currentLanguage = this.loadLanguage();
        this.translations = translations; // From config.js
    }

    /**
     * Load saved language preference or default to 'en'
     */
    loadLanguage() {
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    /**
     * Save language preference
     */
    saveLanguage(lang) {
        localStorage.setItem('preferredLanguage', lang);
        this.currentLanguage = lang;
    }

    /**
     * Get translation for a key
     */
    t(key) {
        const langPack = this.translations[this.currentLanguage] || {};
        if (langPack[key]) {
            return langPack[key];
        }

        const fallback = this.translations['en'] || {};
        return fallback[key] || key;
    }

    /**
     * Set language and update UI
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language '${lang}' not found`);
            return;
        }

        this.saveLanguage(lang);
        this.updateUI();
        this.updateFontClass();
    }

    /**
     * Update all UI elements with data-i18n attribute
     */
    updateUI() {
        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update values (for buttons, etc.)
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            element.value = this.t(key);
        });

        // Update titles/aria-labels
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.setAttribute('title', this.t(key));
        });

        // Update language switcher active state
        this.updateLanguageSwitcher();
    }

    /**
     * Update language switcher buttons
     */
    updateLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Update font class for Bengali
     */
    updateFontClass() {
        if (this.currentLanguage === 'bn') {
            document.body.classList.add('lang-bn');
        } else {
            document.body.classList.remove('lang-bn');
        }
    }

    /**
     * Initialize language switcher buttons
     */
    initLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    /**
     * Initialize i18n on page load
     */
    init() {
        this.updateUI();
        this.updateFontClass();
        this.initLanguageSwitcher();
    }
}

// Create global instance
const i18n = new I18n();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
