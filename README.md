# PromptQuest: The Prompt Engineering Dojo

An interactive web game that teaches prompt engineering to professionals. Inspired by [prompts.chat/kids](https://prompts.chat/kids) and based on ["The Interactive Book of Prompting"](https://prompts.chat/book) by Fatih Kadir Akın.

## What It Is

20 levels across 5 themed zones, each teaching a specific prompt engineering concept through realistic professional scenarios:

| Zone | Theme | Techniques |
|------|-------|------------|
| Foundation Valley | Basics | Clarity, context, prompt anatomy |
| Technique Tower | Core methods | Role-based, chain-of-thought, few-shot, structured output |
| Refinement Ridge | Advanced | Iterative refinement, prompt chaining, system prompts |
| Pitfall Peaks | Debugging | Common mistakes, hallucinations, over/under-prompting |
| Mastery Mountain | Real-world | Business use cases, code generation, complex workflows |

## Challenge Types

- **Multiple Choice** -- Pick the best answer
- **Compare Prompts** -- Choose the better prompt and explain why
- **Drag & Drop** -- Arrange prompt components in the right order
- **Fill in the Blanks** -- Complete a prompt template
- **Spot the Bug** -- Find what's wrong with a given prompt

## Tech Stack

- Pure HTML5 + CSS3 + Vanilla JavaScript
- Zero dependencies, zero build step
- Progress saved to localStorage
- Fully responsive (mobile + desktop)
- Dark theme, professional aesthetic

## Deployment

### Option 1: GitHub Pages (Recommended)

1. Create a new GitHub repo (e.g., `yourusername/promptquest`)
2. Push this code to the repo
3. Go to Settings > Pages > Source: `main` branch, `/` root
4. Your game will be live at `https://yourusername.github.io/promptquest`

```bash
git init
git add .
git commit -m "Initial commit: PromptQuest game"
git remote add origin https://github.com/YOUR_USERNAME/promptquest.git
git push -u origin main
```

### Option 2: Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. No build settings needed (static site)
4. Deployed instantly with a custom URL

### Option 3: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and import the repo
3. Build command: (leave empty)
4. Publish directory: (leave empty, or `/`)
5. Deployed instantly

### Option 4: Any Static Host

Just upload the files to any web server. No backend needed.

```bash
# Local preview
python3 -m http.server 8000
# Open http://localhost:8000
```

## Project Structure

```
promptquest/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (dark theme, responsive)
├── js/
│   ├── levels.js       # 20 level definitions with scenarios
│   └── game.js         # Game engine (state, navigation, scoring)
├── assets/             # (empty -- all graphics are CSS/SVG)
├── README.md           # This file
└── LICENSE             # CC0 1.0 Universal
```

## Customization

### Adding/Editing Levels

Edit `js/levels.js`. Each level has this structure:

```javascript
{
  id: "1-1",              // Zone-Level format
  zone: 1,                // Zone number (1-5)
  zoneName: "Foundation Valley",
  title: "What is a Prompt?",
  scenario: "Real-world scenario text...",
  challenge: "multiple_choice",  // or: compare_prompts, drag_drop, fill_blanks, spot_bug
  question: "The question text...",
  // ... challenge-specific fields
  explanation: "Shown after answering...",
  hint: "Hint text..."
}
```

### Changing the Theme

Edit CSS variables in `css/style.css`:

```css
:root {
  --bg-primary: #0a0a0f;
  --accent-blue: #4a9eff;
  --accent-purple: #a855f7;
  /* ... */
}
```

## Credits

- Based on ["The Interactive Book of Prompting"](https://prompts.chat/book) by Fatih Kadir Akın
- Inspired by [Promi's Prompt School](https://prompts.chat/kids)
- Licensed under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)

## License

This project is released under [CC0 1.0 Universal (Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/). You can copy, modify, distribute, and perform the work, even for commercial purposes, all without asking permission.
