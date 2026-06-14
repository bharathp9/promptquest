// PromptQuest - Background Music Player
// Tries to play assets/music.mp3; falls back to a gentle tone if file is missing
// Auto-starts on first user interaction (browser autoplay policy requires this)

const Music = {
    audio: null,
    isPlaying: false,
    toggleBtn: null,
    fallbackOsc: null,
    fallbackGain: null,
    fallbackCtx: null,
    fallbackInterval: null,
    started: false,

    init() {
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = 0.3;

        // Try multiple paths for GitHub Pages compatibility
        const paths = [
            './assets/music.mp3',
            '/promptquest/assets/music.mp3',
            'assets/music.mp3'
        ];

        const tryLoadPath = (index) => {
            if (index >= paths.length) return;
            this.audio.src = paths[index];
        };

        tryLoadPath(0);

        this.audio.addEventListener('error', () => {
            const currentIndex = paths.findIndex(p => this.audio.src.includes(p));
            if (currentIndex < paths.length - 1) {
                tryLoadPath(currentIndex + 1);
            }
        });

        // Create toggle button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128266; Music Off';
        this.toggleBtn.title = 'Click to toggle music';
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.insertBefore(this.toggleBtn, headerRight.firstChild);
        }

        // Start music on first user interaction (required by browser autoplay policy)
        this._bindFirstInteraction();
    },

    _bindFirstInteraction() {
        const startOnInteraction = (e) => {
            // Don't auto-start if user clicked the music button itself
            if (this.toggleBtn && this.toggleBtn.contains(e.target)) return;

            if (!this.started) {
                this.started = true;
                this._startMusic();
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
        };

        document.addEventListener('click', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
    },

    toggle() {
        if (this.isPlaying) this.stop();
        else this._startMusic();
    },

    _startMusic() {
        if (this.isPlaying) return;
        this.started = true;

        // Try playing the audio file first
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateBtn();
            }).catch(() => {
                // Audio file failed or blocked, try fallback tone
                this._startFallbackTone();
            });
        } else {
            this._startFallbackTone();
        }
    },

    _startFallbackTone() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === 'suspended') ctx.resume();

            this.fallbackCtx = ctx;
            this.fallbackGain = ctx.createGain();
            this.fallbackGain.gain.value = 0.06;
            this.fallbackGain.connect(ctx.destination);

            this.fallbackOsc = ctx.createOscillator();
            this.fallbackOsc.type = 'sine';
            this.fallbackOsc.frequency.value = 392;
            this.fallbackOsc.connect(this.fallbackGain);
            this.fallbackOsc.start();

            this.fallbackInterval = setInterval(() => {
                if (this.fallbackOsc) {
                    const current = this.fallbackOsc.frequency.value;
                    this.fallbackOsc.frequency.value = current === 392 ? 329.63 : 392;
                }
            }, 2000);

            this.isPlaying = true;
            this.updateBtn();
        } catch (e) {
            // Audio not supported
        }
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        this.audio.pause();
        this.audio.currentTime = 0;

        if (this.fallbackOsc) {
            try { this.fallbackOsc.stop(); } catch(e) {}
            this.fallbackOsc = null;
        }
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
        if (this.fallbackCtx) {
            try { this.fallbackCtx.close(); } catch(e) {}
            this.fallbackCtx = null;
        }

        this.updateBtn();
    },

    updateBtn() {
        if (this.isPlaying) {
            this.toggleBtn.innerHTML = '&#128264; Music On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        } else {
            this.toggleBtn.innerHTML = '&#128266; Music Off';
            this.toggleBtn.style.color = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => setTimeout(() => Music.init(), 200));
