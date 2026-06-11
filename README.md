# PromptQuest: The Prompt Engineering Dojo

An interactive web game that teaches prompt engineering to professionals. Built for SWAI (Strategic Workshops in AI) -- free, no signup, works offline.

## What It Is

A single-page game with 20 levels across 5 zones that teaches professional prompt engineering through interactive challenges:

1. **Foundation Valley** -- Basics: clarity, specificity, context, anatomy of a prompt
2. **Technique Tower** -- Core methods: role-based, chain-of-thought, few-shot, structured output
3. **Refinement Ridge** -- Advanced: iterative refinement, chaining, system prompts, edge cases
4. **Pitfall Peaks** -- Debugging: common mistakes, hallucination prevention, balance, ethics
5. **Mastery Mountain** -- Real-world: business use cases, code generation, multi-step workflows

## Challenge Types

- **Multiple Choice** -- Pick the best prompt approach
- **Compare & Choose** -- Select the better prompt between two options
- **Fill in the Blank** -- Complete a prompt with the right context or technique
- **Drag & Drop** -- Arrange prompt components in the correct order

## Features

- Dark theme, professional aesthetic (Linear/Stripe inspired)
- 3-star scoring system per level
- Progressive unlocking (complete levels to unlock the next)
- Progress saved to localStorage
- Hints available (reduces star rating)
- Responsive design (mobile + desktop)
- Works offline after first load
- Zero dependencies, no backend

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript
- No framework, no build step, no dependencies
- Deployable to GitHub Pages, Vercel, or Netlify with zero config

## Quick Start

```bash
# Clone
git clone https://github.com/bharathp9/promptquest.git
cd promptquest

# Open in browser (no server needed)
open index.html

# Or serve locally
python3 -m http.server 8000
```

## Deploy to GitHub Pages

1. Push to `bharathp9/promptquest` repo
2. Go to Settings > Pages > Source: main branch
3. Your game will be live at `https://bharathp9.github.io/promptquest`

## For SWAI

This project is designed as a hands-on learning tool for SWAI (Strategic Workshops in AI) participants. Share the link with attendees so they can practice prompt engineering before, during, or after the workshop.

## License

CC0 -- Free for any use, no attribution required.
