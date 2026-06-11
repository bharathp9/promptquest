// PromptQuest - Simple Ambient Music
// Uses Web Audio API to generate a pleasant ambient drone
// No external files needed

const Music = {
    ctx: null,
    oscillators: [],
    gainNode: null,
    isPlaying: false,
    toggleBtn: null,

    init() {
        // Create toggle button in header
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'btn btn-small btn-ghost';
        this.toggleBtn.innerHTML = '&#128266; Music';
        this.toggleBtn.title = 'Toggle background music';
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Insert before the gallery button
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
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0.08; // Very subtle
            this.gainNode.connect(this.ctx.destination);

            // Create a pleasant ambient chord (C major 7th)
            // C4, E4, G4, B4
            const frequencies = [261.63, 329.63, 392.00, 493.88];

            frequencies.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq;

                // Add slight detuning for warmth
                osc.detune.value = (i - 1.5) * 5;

                const oscGain = this.ctx.createGain();
                oscGain.gain.value = 0.25;

                osc.connect(oscGain);
                oscGain.connect(this.gainNode);
                osc.start();

                this.oscillators.push({ osc, gain: oscGain });
            });

            // Add a slow LFO for gentle movement
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1; // Very slow

            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 3;

            lfo.connect(lfoGain);
            lfoGain.connect(this.gainNode.gain);
            lfo.start();

            this.oscillators.push({ osc: lfo, gain: lfoGain });

            this.isPlaying = true;
            this.toggleBtn.innerHTML = '&#128266; Music On';
            this.toggleBtn.style.color = 'var(--accent-green)';
        } catch (e) {
            console.warn('Could not start music:', e);
        }
    },

    stop() {
        if (!this.isPlaying) return;

        // Fade out
        if (this.gainNode) {
            this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        }

        setTimeout(() => {
            this.oscillators.forEach(o => {
                try { o.osc.stop(); } catch(e) {}
            });
            this.oscillators = [];
            if (this.ctx) {
                this.ctx.close();
                this.ctx = null;
            }
            this.gainNode = null;
        }, 600);

        this.isPlaying = false;
        this.toggleBtn.innerHTML = '&#128266; Music';
        this.toggleBtn.style.color = '';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure game is loaded
    setTimeout(() => Music.init(), 100);
});
