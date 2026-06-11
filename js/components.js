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

        // Show the question with blank highlighted
        const display = document.createElement('div');
        display.className = 'prompt-display';
        display.innerHTML = level.question.replace(/_______________/g, '<span class="blank">[your answer]</span>');
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

            // Smart matching: check multiple strategies
            const isCorrect = this._checkFillBlankAnswer(userAnswer, level);

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
    },

    // Smart fill-blank answer checking
    // Strategy 1: exact acceptable match (user input contains the acceptable phrase)
    // Strategy 2: keyword overlap (user shares 2+ meaningful keywords with any acceptable answer)
    // Strategy 3: answer field match (user input contains the main answer keyword)
    _checkFillBlankAnswer(userAnswer, level) {
        const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'where', 'how', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their', 'e', 'g']);

        // Extract meaningful keywords from user input
        const userWords = userAnswer.split(/[\s,]+/).filter(w => w.length > 1 && !stopWords.has(w));

        // Strategy 1: Check if user input contains any acceptable phrase (original logic, reversed)
        if (level.acceptable) {
            for (const acceptable of level.acceptable) {
                const accLower = acceptable.toLowerCase();
                // User input contains the full acceptable phrase
                if (userAnswer.includes(accLower)) return true;
                // Acceptable phrase contains the user's full input (user typed a short form)
                if (accLower.includes(userAnswer) && userAnswer.length > 3) return true;

                // Strategy 2: Keyword overlap
                const accWords = accLower.split(/[\s,]+/).filter(w => w.length > 1 && !stopWords.has(w));
                const overlap = userWords.filter(w => accWords.some(aw => aw.includes(w) || w.includes(aw)));
                // If user shares 2+ keywords with an acceptable answer, or 1 keyword if the acceptable is short
                const threshold = accWords.length <= 2 ? 1 : 2;
                if (overlap.length >= threshold) return true;
            }
        }

        // Strategy 3: Check against main answer field
        if (level.answer) {
            const answerLower = level.answer.toLowerCase();
            if (userAnswer.includes(answerLower)) return true;
            if (answerLower.includes(userAnswer) && userAnswer.length > 3) return true;

            const answerWords = answerLower.split(/[\s,]+/).filter(w => w.length > 1 && !stopWords.has(w));
            const overlap = userWords.filter(w => answerWords.some(aw => aw.includes(w) || w.includes(aw)));
            if (overlap.length >= 2) return true;
        }

        return false;
    }
};
