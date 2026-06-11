// PromptQuest - Background Music Player
// Plays music.mp3 from the assets folder in a loop

const Music = {
    audio: null,
    isPlaying: false,
    toggleBtn: null,

    init() {
        // Create audio element
        this.audio = new Audio('assets/music.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.3;

        // Create toggle button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128266; Music Off';
        this.toggleBtn.title = 'Click to play music';
        this.toggleBtn.addEventListener('click', () => this.toggle());

        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.insertBefore(this.toggleBtn, headerRight.firstChild);
        }
    },

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    },

    play() {
        if (!this.audio) return;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.toggleBtn.innerHTML = '&#128264; Music On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        }).catch((e) => {
            console.warn('Music play failed:', e);
        });
    },

    stop() {
        if (!this.audio) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.toggleBtn.innerHTML = '&#128266; Music Off';
        this.toggleBtn.style.color = '';
    }
};

document.addEventListener('DOMContentLoaded', () => setTimeout(() => Music.init(), 200));
