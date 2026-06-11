// PromptQuest - Game Music
// Procedurally generated chiptune-style melody using Web Audio API
// Light, playful, game-like feel -- no external files needed

const Music = {
    ctx: null,
    isPlaying: false,
    toggleBtn: null,
    schedulerTimer: null,
    nextNoteTime: 0,
    currentStep: 0,

    // Pentatonic scale notes (C major pentatonic -- always sounds pleasant)
    // Frequencies in Hz
    scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],

    // A simple repeating melody pattern (indices into scale)
    // Creates a playful, recognizable tune
    melody: [
        0, 2, 4, 5, 4, 2, 3, 1,
        0, 2, 4, 7, 5, 4, 2, 0,
        3, 4, 5, 4, 3, 2, 1, 0,
        0, 1, 2, 3, 2, 1, 0, 0
    ],

    // Bass pattern (root notes, lower octave)
    bass: [0, 0, 3, 3, 4, 4, 3, 0],

    init() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128264; Music';
        this.toggleBtn.title = 'Toggle background music';
        this.toggleBtn.addEventListener('click', () => this.toggle());

        const headerRight = document.querySelector('.header-right');
        headerRight.insertBefore(this.toggleBtn, headerRight.firstChild);
    },

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    },

    play() {
        if (this.isPlaying) return;

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.12;
            this.masterGain.connect(this.ctx.destination);

            this.nextNoteTime = this.ctx.currentTime + 0.1;
            this.currentStep = 0;
            this.isPlaying = true;

            this.scheduler();
            this.toggleBtn.innerHTML = '&#128264; Music On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        } catch (e) {
            console.warn('Could not start music:', e);
        }
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;

        if (this.schedulerTimer) {
            clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }

        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }

        this.toggleBtn.innerHTML = '&#128264; Music';
        this.toggleBtn.style.color = '';
    },

    scheduler() {
        if (!this.isPlaying) return;

        // Schedule notes ahead of time (lookahead)
        while (this.nextNoteTime < this.ctx.currentTime + 0.15) {
            this.playNote(this.nextNoteTime);
            this.nextNoteTime += 0.25; // 16th notes at ~120bpm feel
            this.currentStep = (this.currentStep + 1) % this.melody.length;
        }

        this.schedulerTimer = setTimeout(() => this.scheduler(), 50);
    },

    playNote(time) {
        const step = this.currentStep;

        // --- Melody ---
        const melodyIdx = this.melody[step];
        const melodyFreq = this.scale[melodyIdx];

        const melOsc = this.ctx.createOscillator();
        melOsc.type = 'triangle'; // Soft, game-like tone
        melOsc.frequency.value = melodyFreq;

        const melGain = this.ctx.createGain();
        melGain.gain.setValueAtTime(0.3, time);
        melGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

        melOsc.connect(melGain);
        melGain.connect(this.masterGain);
        melOsc.start(time);
        melOsc.stop(time + 0.22);

        // --- Bass (every 2 steps) ---
        if (step % 2 === 0) {
            const bassIdx = this.bass[Math.floor(step / 2) % this.bass.length];
            const bassFreq = this.scale[bassIdx] / 2; // One octave lower

            const bassOsc = this.ctx.createOscillator();
            bassOsc.type = 'sine';
            bassOsc.frequency.value = bassFreq;

            const bassGain = this.ctx.createGain();
            bassGain.gain.setValueAtTime(0.2, time);
            bassGain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

            bassOsc.connect(bassGain);
            bassGain.connect(this.masterGain);
            bassOsc.start(time);
            bassOsc.stop(time + 0.45);
        }

        // --- Light percussion (every 4 steps) ---
        if (step % 4 === 0) {
            // High "tick"
            const tickOsc = this.ctx.createOscillator();
            tickOsc.type = 'square';
            tickOsc.frequency.value = 1200;

            const tickGain = this.ctx.createGain();
            tickGain.gain.setValueAtTime(0.08, time);
            tickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

            tickOsc.connect(tickGain);
            tickGain.connect(this.masterGain);
            tickOsc.start(time);
            tickOsc.stop(time + 0.06);
        }

        if (step % 8 === 4) {
            // Lower "tock"
            const tockOsc = this.ctx.createOscillator();
            tockOsc.type = 'square';
            tockOsc.frequency.value = 600;

            const tockGain = this.ctx.createGain();
            tockGain.gain.setValueAtTime(0.06, time);
            tockGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

            tockOsc.connect(tockGain);
            tockGain.connect(this.masterGain);
            tockOsc.start(time);
            tockOsc.stop(time + 0.07);
        }

        // --- Occasional sparkle (every 16 steps on the downbeat) ---
        if (step % 16 === 0) {
            const sparkleFreq = this.scale[6] * 2; // High note
            const sparkOsc = this.ctx.createOscillator();
            sparkOsc.type = 'sine';
            sparkOsc.frequency.value = sparkleFreq;

            const sparkGain = this.ctx.createGain();
            sparkGain.gain.setValueAtTime(0.1, time);
            sparkGain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

            sparkOsc.connect(sparkGain);
            sparkGain.connect(this.masterGain);
            sparkOsc.start(time);
            sparkOsc.stop(time + 0.35);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Music.init(), 100);
});
