// PromptQuest - Reusable UI Components

const Components = {
    // Create a multiple choice question
    createMultipleChoice(level, onAnswer) {
        const container = document.createElement('div');
        container.className = 'challenge-multiple-choice';

        const prompt = document.createElement('p');
        prompt.className = 'challenge-prompt';
        prompt.textContent = level.question;
        container.appendChild(prompt);

        const list = document.createElement('div');
        list.className = 'choice-list';

        level.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-item';
            btn.textContent = choice;
            btn.addEventListener('click', () => {
                list.querySelectorAll('.choice-item').forEach(b => {
                    b.classList.add('disabled');
                });

                const isCorrect = index === level.correct;
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');

                if (!isCorrect) {
                    list.querySelectorAll('.choice-item')[level.correct].classList.add('correct');
                }

                setTimeout(() => onAnswer(isCorrect, index), 800);
            });
            list.appendChild(btn);
        });

        container.appendChild(list);
        return container;
    },

    // Create a compare-choice question (two options side by side)
    createCompareChoice(level, onAnswer) {
        const container = document.createElement('div');
        container.className = 'challenge-compare';

        const prompt = document.createElement('p');
        prompt.className = 'challenge-prompt';
        prompt.textContent = level.question;
        container.appendChild(prompt);

        const list = document.createElement('div');
        list.className = 'choice-list';

        level.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-item';
            btn.textContent = choice;
            btn.addEventListener('click', () => {
                list.querySelectorAll('.choice-item').forEach(b => {
                    b.classList.add('disabled');
                });

                const isCorrect = index === level.correct;
                btn.classList.add(isCorrect ? 'correct' : 'incorrect');

                if (!isCorrect) {
                    list.querySelectorAll('.choice-item')[level.correct].classList.add('correct');
                }

                setTimeout(() => onAnswer(isCorrect, index), 800);
            });
            list.appendChild(btn);
        });

        container.appendChild(list);
        return container;
    },

    // Create a fill-in-the-blank question
    createFillBlank(level, onAnswer) {
        const container = document.createElement('div');
        container.className = 'challenge-fill-blank';

        const prompt = document.createElement('p');
        prompt.className = 'challenge-prompt';
        prompt.textContent = level.question;
        container.appendChild(prompt);

        const display = document.createElement('div');
        display.className = 'prompt-display';
        display.innerHTML = level.question.replace('_______________', '<span class="blank">[your answer]</span>');
        container.appendChild(display);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'blank-input';
        input.placeholder = level.placeholder || 'Type your answer here...';
        input.autocomplete = 'off';
        container.appendChild(input);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = 'Check Answer';
        submitBtn.addEventListener('click', () => {
            const userAnswer = input.value.trim().toLowerCase();
            if (!userAnswer) return;

            const isCorrect = level.acceptable
                ? level.acceptable.some(a => userAnswer.includes(a.toLowerCase()))
                : userAnswer.includes(level.answer.toLowerCase());

            input.classList.add(isCorrect ? 'correct' : 'incorrect');
            submitBtn.disabled = true;

            setTimeout(() => onAnswer(isCorrect, userAnswer), 800);
        });

        container.appendChild(submitBtn);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitBtn.click();
        });

        return container;
    },

    // Create an ordering question (click-based, mobile-friendly)
    createDragDrop(level, onAnswer) {
        const container = document.createElement('div');
        container.className = 'challenge-drag-drop';

        const prompt = document.createElement('p');
        prompt.className = 'challenge-prompt';
        prompt.textContent = level.question;
        container.appendChild(prompt);

        // Shuffle items
        const shuffled = [...level.items].map((text, origIdx) => ({ text, origIdx }));
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const placed = []; // items the user has selected, in order

        // Source zone - items to pick from
        const sourceZone = document.createElement('div');
        sourceZone.className = 'drag-container';

        shuffled.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'drag-item';
            el.textContent = item.text;
            el.dataset.idx = idx;

            el.addEventListener('click', () => {
                if (el.classList.contains('placed')) return;

                // Add to placed
                placed.push(item);
                el.classList.add('placed');

                // Add to drop zone
                const placedEl = document.createElement('div');
                placedEl.className = 'drag-item placed-item';
                placedEl.textContent = item.text;
                placedEl.addEventListener('click', () => {
                    // Remove from placed
                    const pIdx = placed.indexOf(item);
                    if (pIdx > -1) placed.splice(pIdx, 1);
                    placedEl.remove();
                    el.classList.remove('placed');

                    // Re-enable check button if needed
                    checkBtn.disabled = placed.length !== level.items.length;
                });
                dropZone.appendChild(placedEl);

                // Enable check button when all placed
                if (placed.length === level.items.length) {
                    checkBtn.disabled = false;
                }
            });

            sourceZone.appendChild(el);
        });

        container.appendChild(sourceZone);

        // Drop zone - where placed items appear
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.textContent = 'Click items above to add them here in the correct order...';
        container.appendChild(dropZone);

        // Check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary';
        checkBtn.textContent = 'Check Order';
        checkBtn.disabled = true;
        checkBtn.style.marginTop = '16px';
        checkBtn.addEventListener('click', () => {
            const userOrder = placed.map(i => i.text);
            const isCorrect = userOrder.length === level.correctOrder.length &&
                userOrder.every((text, idx) => text === level.correctOrder[idx]);

            if (isCorrect) {
                dropZone.querySelectorAll('.placed-item').forEach(el => {
                    el.style.borderColor = 'var(--accent-green)';
                });
            } else {
                dropZone.querySelectorAll('.placed-item').forEach(el => {
                    el.style.borderColor = 'var(--accent-red)';
                });
            }

            checkBtn.disabled = true;
            setTimeout(() => onAnswer(isCorrect, userOrder), 800);
        });

        container.appendChild(checkBtn);
        return container;
    },

    // Show feedback
    showFeedback(type, message) {
        const fb = document.getElementById('game-feedback');
        fb.className = type;
        fb.innerHTML = message;
        fb.classList.remove('hidden');
    },

    // Hide feedback
    hideFeedback() {
        document.getElementById('game-feedback').classList.add('hidden');
    },

    // Create hint box
    createHint(text) {
        const box = document.createElement('div');
        box.className = 'hint-box';
        box.innerHTML = `<strong>Hint:</strong> ${text}`;
        return box;
    },

    // Create action buttons
    createActions(buttons) {
        const container = document.getElementById('game-actions');
        container.innerHTML = '';
        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.className = `btn ${b.class || 'btn-secondary'}`;
            btn.textContent = b.label;
            btn.addEventListener('click', b.onClick);
            container.appendChild(btn);
        });
        return container;
    }
};
