// PromptQuest - Background Music Player
// Tries to play assets/music.mp3; falls back to a gentle tone if file is missing

const Music = {
    audio: null,
    isPlaying: false,
    toggleBtn: null,
    fallbackOsc: null,
    fallbackGain: null,

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
            if (index >= paths.length) {
                console.warn('Music: No more paths to try');
                return;
            }
            this.audio.src = paths[index];
            console.log('Music: Loading from', paths[index]);
        };

        tryLoadPath(0);

        // If the first attempt fails, try the next path
        this.audio.addEventListener('error', () => {
            const currentIndex = paths.findIndex(p => this.audio.src.includes(p));
            console.warn('Music: Failed to load from', this.audio.src);
            if (currentIndex < paths.length - 1) {
                tryLoadPath(currentIndex + 1);
            } else {
                console.warn('Music: All paths exhausted, will use fallback');
            }
        });

        this.audio.addEventListener('canplay', () => {
            console.log('Music: File loaded successfully from', this.audio.src);
        });

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128264; Music On';
        this.toggleBtn.title = 'Click to toggle music';
        this.toggleBtn.addEventListener('click', () => this.toggle());

        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.insertBefore(this.toggleBtn, headerRight.firstChild);
        }

        // Auto-play music when page loads
        setTimeout(() => this.play(), 500);
    },

    toggle() {
        if (this.isPlaying) this.stop();
        else this.play();
    },

    play() {
        if (this.isPlaying) return;

        // Try MP3 first
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateBtn();
            }).catch(() => {
                // MP3 failed, use fallback tone
                this.startFallbackTone();
            });
        }
    },

    startFallbackTone() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === 'suspended') ctx.resume();

            this.fallbackCtx = ctx;
            this.fallbackGain = ctx.createGain();
            this.fallbackGain.gain.value = 0.06;
            this.fallbackGain.connect(ctx.destination);

            // Simple pleasant two-note alternation
            this.fallbackOsc = ctx.createOscillator();
            this.fallbackOsc.type = 'sine';
            this.fallbackOsc.frequency.value = 392; // G4
            this.fallbackOsc.connect(this.fallbackGain);
            this.fallbackOsc.start();

            // Alternate between two notes every 2 seconds
            this.fallbackInterval = setInterval(() => {
                if (this.fallbackOsc) {
                    const current = this.fallbackOsc.frequency.value;
                    this.fallbackOsc.frequency.value = current === 392 ? 329.63 : 392; // G4 <-> E4
                }
            }, 2000);

            this.isPlaying = true;
            this.updateBtn();
        } catch (e) {
        }
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        // Stop MP3
        this.audio.pause();
        this.audio.currentTime = 0;

        // Stop fallback
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
