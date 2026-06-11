// PromptQuest - Game Music
// Uses a generated melody with pleasant chiptune tones
// Simple, gentle, game-like background music

const Music = {
    ctx: null,
    isPlaying: false,
    toggleBtn: null,
    intervalId: null,
    step: 0,
    bpm: 120,

    // All note frequencies
    n: {
        C3: 130.81, D3: 146.83, E3: 164.81, G3: 196.00, A3: 220.00,
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99
    },

    // Simple happy melody: C C G G A A G | F F E E D D C | G G F F E E D D | G G F F E E C
    melody: [
        'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 0,
        'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4', 0,
        'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 0,
        'G4', 'G4', 'F4', 'F4', 'E4', 'E4', 'C4', 0,
    ],

    // Bass: C - F - G - C
    bass: ['C3', 0, 0, 0, 'F3', 0, 0, 0, 'G3', 0, 0, 0, 'C3', 0, 0, 0,
            'C3', 0, 0, 0, 'F3', 0, 0, 0, 'G3', 0, 0, 0, 'C3', 0, 0, 0],

    init() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128266; Music';
        this.toggleBtn.title = 'Toggle background music';
        this.toggleBtn.addEventListener('click', () => this.toggle());

        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            headerRight.insertBefore(this.toggleBtn, headerRight.firstChild);
        }
    },

    toggle() {
        if (this.isPlaying) this.stop();
        else this.play();
    },

    play() {
        if (this.isPlaying) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            this.gain = this.ctx.createGain();
            this.gain.gain.value = 0.12;
            this.gain.connect(this.ctx.destination);

            this.step = 0;
            this.isPlaying = true;

            // Play a note immediately
            this.playStep();

            // Then schedule subsequent notes
            const beatMs = (60 / this.bpm) * 1000;
            this.intervalId = setInterval(() => {
                this.step++;
                this.playStep();
            }, beatMs);

            this.toggleBtn.innerHTML = '&#128266; On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        } catch (e) {
            console.warn('Music error:', e);
        }
    },

    stop() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
        if (this.ctx) { try { this.ctx.close(); } catch(e){} this.ctx = null; }
        this.toggleBtn.innerHTML = '&#128266; Music';
        this.toggleBtn.style.color = '';
    },

    playStep() {
        if (!this.ctx || !this.isPlaying) return;
        const i = this.step % this.melody.length;
        const time = this.ctx.currentTime;

        // Melody
        const melNote = this.melody[i];
        if (melNote) {
            this.tone(this.n[melNote], time, 0.2, 'square', 0.2);
            // Soft harmony
            this.tone(this.n[melNote] * 1.5, time, 0.15, 'sine', 0.06);
        }

        // Bass (every other step for variety)
        if (i % 2 === 0) {
            const bassNote = this.bass[i];
            if (bassNote) {
                this.tone(this.n[bassNote], time, 0.35, 'triangle', 0.18);
            }
        }

        // Light hi-hat every 4 steps
        if (i % 4 === 0) {
            this.noise(time, 0.03, 0.04);
        }
        if (i % 8 === 4) {
            this.noise(time, 0.05, 0.03);
        }
    },

    tone(freq, time, dur, type, vol) {
        if (!freq) return;
        const o = this.ctx.createOscillator();
        o.type = type;
        o.frequency.value = freq;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.linearRampToValueAtTime(0.001, time + dur);
        o.connect(g);
        g.connect(this.gain);
        o.start(time);
        o.stop(time + dur + 0.01);
    },

    noise(time, vol, dur) {
        // Simple white noise burst using buffer
        const bufSize = this.ctx.sampleRate * dur;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.linearRampToValueAtTime(0.001, time + dur);
        src.connect(g);
        g.connect(this.gain);
        src.start(time);
        src.stop(time + dur + 0.01);
    }
};

document.addEventListener('DOMContentLoaded', () => setTimeout(() => Music.init(), 200));
