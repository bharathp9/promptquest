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
                // Disable all buttons
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

        // Show prompt display with blank
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

        // Allow Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitBtn.click();
        });

        return container;
    },

    // Create a drag-and-drop ordering question
    createDragDrop(level, onAnswer) {
        const container = document.createElement('div');
        container.className = 'challenge-drag-drop';

        const prompt = document.createElement('p');
        prompt.className = 'challenge-prompt';
        prompt.textContent = level.question;
        container.appendChild(prompt);

        // Shuffle items
        const shuffled = [...level.items].sort(() => Math.random() - 0.5);
        const placed = [];

        const sourceZone = document.createElement('div');
        sourceZone.className = 'drag-container';
        sourceZone.id = 'drag-source';

        shuffled.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'drag-item';
            el.textContent = item;
            el.draggable = true;
            el.dataset.index = idx;
            el.dataset.text = item;

            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ text: item, index: idx }));
                e.dataTransfer.effectAllowed = 'move';
            });

            sourceZone.appendChild(el);
        });

        container.appendChild(sourceZone);

        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.id = 'drag-drop';
        dropZone.textContent = 'Drag items here in the correct order...';

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (placed.includes(data.index)) return;

            placed.push(data.index);
            const el = document.createElement('div');
            el.className = 'drag-item';
            el.textContent = data.text;
            el.addEventListener('click', () => {
                // Remove from drop zone, add back to source
                el.remove();
                placed.splice(placed.indexOf(data.index), 1);
                sourceZone.querySelector(`[data-index="${data.index}"]`).classList.remove('placed');
            });
            dropZone.appendChild(el);
            sourceZone.querySelector(`[data-index="${data.index}"]`).classList.add('placed');

            // Check if all items placed
            if (placed.length === level.items.length) {
                const userOrder = placed.map(i => shuffled[i].text);
                const isCorrect = JSON.stringify(userOrder) === JSON.stringify(level.correctOrder);

                setTimeout(() => onAnswer(isCorrect, userOrder), 500);
            }
        });

        container.appendChild(dropZone);
        return container;
    },

    // Show feedback
    showFeedback(type, message) {
        const fb = document.getElementById('game-feedback');
        fb.className = type; // success, error, partial
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
