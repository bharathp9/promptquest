// PromptQuest - Game Music
// Procedurally generated upbeat game melody using Web Audio API
// Think: gentle mobile game background music

const Music = {
    ctx: null,
    isPlaying: false,
    toggleBtn: null,
    schedulerTimer: null,
    nextNoteTime: 0,
    step: 0,
    bpm: 140,

    // Notes as named frequencies
    notes: {
        C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
        C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47
    },

    // Melody: a cheerful, memorable tune (note name, duration in beats)
    // "Twinkle Twinkle" inspired but original, in C major
    tune: [
        // Bar 1 - ascending, hopeful
        ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1],
        // Bar 2 - peak and descend
        ['A4', 1], ['A4', 1], ['G4', 2],
        // Bar 3 - playful bounce
        ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1],
        // Bar 4 - resolve
        ['D4', 1], ['D4', 1], ['C4', 2],
        // Bar 5 - variation up
        ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1],
        // Bar 6 - variation down
        ['E4', 1], ['E4', 1], ['D4', 2],
        // Bar 7 - higher energy
        ['G4', 1], ['G4', 1], ['F4', 1], ['F4', 1],
        // Bar 8 - resolve home
        ['E4', 1], ['E4', 1], ['C4', 2],
    ],

    // Bass accompaniment (note, duration)
    bassLine: [
        ['C3', 4], ['F3', 4], ['G3', 4], ['C3', 4],
        ['C3', 4], ['F3', 4], ['G3', 4], ['C3', 4],
    ],

    init() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128264; Music';
        this.toggleBtn.title = 'Toggle background music';
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
        if (this.isPlaying) return;

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Master volume
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.15;
            this.master.connect(this.ctx.destination);

            this.nextNoteTime = this.ctx.currentTime + 0.05;
            this.step = 0;
            this.isPlaying = true;

            this.scheduler();
            this.toggleBtn.innerHTML = '&#128264; Music On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        } catch (e) {
            console.warn('Music failed to start:', e);
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
            try { this.ctx.close(); } catch(e) {}
            this.ctx = null;
        }

        this.toggleBtn.innerHTML = '&#128264; Music';
        this.toggleBtn.style.color = '';
    },

    scheduler() {
        if (!this.isPlaying || !this.ctx) return;

        const lookahead = 0.2;
        while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
            this.scheduleMelody();
            this.scheduleBass();
            this.nextNoteTime += 60 / this.bpm; // one beat
            this.step++;
        }

        this.schedulerTimer = setTimeout(() => this.scheduler(), 40);
    },

    scheduleMelody() {
        // Figure out which melody note(s) fall on this beat
        let beatPos = 0;
        for (let i = 0; i < this.tune.length; i++) {
            const [note, dur] = this.tune[i];
            if (beatPos === this.step % this.getTotalBeats()) {
                this.playTone(note, this.nextNoteTime, dur * (60 / this.bpm) * 0.9, 'square', 0.18);
                // Add a harmony note a third above for richness
                this.playHarmony(note, this.nextNoteTime, dur * (60 / this.bpm) * 0.9);
                break;
            }
            beatPos += dur;
            if (beatPos > this.step % this.getTotalBeats()) break;
        }
    },

    scheduleBass() {
        const totalBassBeats = 32; // 8 bars * 4 beats
        let beatPos = 0;
        for (let i = 0; i < this.bassLine.length; i++) {
            const [note, dur] = this.bassLine[i];
            if (beatPos === this.step % totalBassBeats) {
                this.playTone(note, this.nextNoteTime, dur * (60 / this.bpm) * 0.8, 'triangle', 0.25);
                break;
            }
            beatPos += dur;
            if (beatPos > this.step % totalBassBeats) break;
        }
    },

    getTotalBeats() {
        return this.tune.reduce((sum, [, d]) => sum + d, 0);
    },

    playTone(noteName, time, duration, type, vol) {
        const freq = this.notes[noteName];
        if (!freq) return;

        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol, time);
        gain.gain.setValueAtTime(vol, time + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + duration + 0.01);
    },

    playHarmony(noteName, time, duration) {
        // Play a fifth above for a fuller sound
        const freq = this.notes[noteName];
        if (!freq) return;

        const fifthFreq = freq * 1.5; // Perfect fifth

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = fifthFreq;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + duration + 0.01);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => Music.init(), 200);
});
