// PromptQuest - Prompt Gallery
// Real-world prompt templates organized by category
// Inspired by prompts.chat (163k+ stars) - https://github.com/f/prompts.chat

const GALLERY_CATEGORIES = [
    { id: "business", name: "Business & Strategy", icon: "&#128200;" },
    { id: "writing", name: "Writing & Content", icon: "&#128221;" },
    { id: "coding", name: "Code & Development", icon: "&#128187;" },
    { id: "analysis", name: "Analysis & Research", icon: "&#128202;" },
    { id: "education", name: "Education & Training", icon: "&#127891;" },
    { id: "creative", name: "Creative & Design", icon: "&#127912;" }
];

const GALLERY_PROMPTS = [
    // Business & Strategy
    {
        id: "b1", category: "business",
        title: "SWOT Analysis Generator",
        prompt: "Act as a senior business strategist. Conduct a SWOT analysis for [COMPANY/PRODUCT]. For each quadrant (Strengths, Weaknesses, Opportunities, Threats), provide 3-5 specific, actionable items with brief explanations. End with 3 strategic recommendations based on the analysis.",
        tags: ["strategy", "analysis", "business planning"]
    },
    {
        id: "b2", category: "business",
        title: "Email Tone Adapter",
        prompt: "Rewrite the following email to be [TONE: professional/casual/empathetic/assertive] while keeping the core message intact. The email is for [RECIPIENT TYPE: client/colleague/manager/subordinate].\n\nOriginal email:\n[PASTE EMAIL HERE]\n\nConstraints:\n- Keep it under 150 words\n- Maintain all key action items\n- End with a clear call to action",
        tags: ["email", "communication", "tone"]
    },
    {
        id: "b3", category: "business",
        title: "Meeting Action Extractor",
        prompt: "You are an executive assistant. Read the meeting notes below and extract:\n\n1. **Decisions Made** (numbered list)\n2. **Action Items** as a table: Task | Owner | Deadline | Priority (H/M/L)\n3. **Open Questions** that need follow-up\n4. **Key Metrics** mentioned\n\nMeeting notes:\n[PASTE NOTES HERE]",
        tags: ["meetings", "productivity", "action items"]
    },
    {
        id: "b4", category: "business",
        title: "Competitive Battlecard",
        prompt: "Create a competitive battlecard for [OUR PRODUCT] vs [COMPETITOR]. Include:\n\n- **Positioning**: One-line positioning for each product\n- **Feature Comparison**: Table with 5-8 key features\n- **Pricing**: Public pricing tiers if available\n- **Strengths & Weaknesses**: For each competitor\n- **Objection Handling**: 3 common objections from prospects and how to counter them\n- **Win Strategy**: When we win vs when they win",
        tags: ["sales", "competitive analysis", "positioning"]
    },

    // Writing & Content
    {
        id: "w1", category: "writing",
        title: "Blog Post Outliner",
        prompt: "You are an expert content strategist. Create a detailed blog post outline for the topic: [TOPIC]. Target audience: [AUDIENCE].\n\nProvide:\n1. 3 headline options (emotional, data-driven, how-to)\n2. Introduction hook (2-3 sentences)\n3. 5-7 main sections with sub-bullets\n4. Key statistics or data points to include\n5. Internal linking suggestions\n6. Conclusion with CTA\n7. SEO meta description (under 160 chars)",
        tags: ["blogging", "SEO", "content strategy"]
    },
    {
        id: "w2", category: "writing",
        title: "Social Media Adapter",
        prompt: "Adapt the following content for [PLATFORM: LinkedIn/Twitter/Instagram/Facebook].\n\nOriginal content:\n[PASTE CONTENT]\n\nRequirements:\n- Character limit: [SPECIFY]\n- Include 3-5 relevant hashtags\n- Tone: [professional/casual/inspirational]\n- Include a hook in the first line\n- End with an engagement question",
        tags: ["social media", "content repurposing", "marketing"]
    },
    {
        id: "w3", category: "writing",
        title: "Technical Documentation Writer",
        prompt: "You are a technical writer. Create clear documentation for [FEATURE/PRODUCT].\n\nStructure:\n1. **Overview** (2-3 sentences, what it does and why it matters)\n2. **Prerequisites** (what users need before starting)\n3. **Step-by-Step Guide** (numbered steps with expected outputs)\n4. **Common Issues & Solutions** (troubleshooting table)\n5. **FAQ** (5 common questions with answers)\n\nUse simple language. Assume the reader is technical but unfamiliar with this specific feature.",
        tags: ["documentation", "technical writing", "user guides"]
    },

    // Code & Development
    {
        id: "c1", category: "coding",
        title: "Code Review Assistant",
        prompt: "Act as a senior code reviewer. Review the following [LANGUAGE] code for:\n\n1. **Correctness**: Logic errors, edge cases, potential bugs\n2. **Performance**: Inefficiencies, unnecessary operations\n3. **Security**: Vulnerabilities, injection risks, data exposure\n4. **Readability**: Naming, structure, missing comments\n5. **Best Practices**: Language-specific conventions\n\nFor each issue found, provide:\n- Severity (Critical/Minor/Suggestion)\n- Line or section reference\n- The problem\n- Suggested fix with code example\n\nCode:\n[PASTE CODE]",
        tags: ["code review", "quality", "best practices"]
    },
    {
        id: "c2", category: "coding",
        title: "Function Generator with Tests",
        prompt: "Write a [LANGUAGE] function that [DESCRIBE FUNCTIONALITY].\n\nRequirements:\n- Input parameters: [SPECIFY]\n- Return type: [SPECIFY]\n- Handle edge cases: [SPECIFY]\n- Time complexity target: [SPECIFY]\n\nInclude:\n1. The function with clear variable names and comments\n2. Input validation\n3. Error handling\n4. 5 unit tests covering: normal cases, edge cases, and error cases\n5. A brief explanation of the algorithm used",
        tags: ["coding", "testing", "functions"]
    },
    {
        id: "c3", category: "coding",
        title: "SQL Query Builder",
        prompt: "You are a SQL expert. Write a [DATABASE: PostgreSQL/MySQL/SQL Server] query for the following requirement:\n\n[DESCRIBE REQUIREMENT IN PLAIN ENGLISH]\n\nTable schema:\n[PASTE SCHEMA]\n\nRequirements:\n- Use appropriate JOINs\n- Include WHERE clauses for filtering\n- Add indexes if needed (comment them)\n- Optimize for readability\n- Add comments explaining complex parts",
        tags: ["SQL", "database", "query optimization"]
    },

    // Analysis & Research
    {
        id: "a1", category: "analysis",
        title: "Data Interpreter",
        prompt: "You are a data analyst. Analyze the following data and provide insights.\n\nData:\n[PASTE DATA OR DESCRIBE DATASET]\n\nProvide:\n1. **Key Findings** (3-5 bullet points)\n2. **Trends**: What patterns do you see?\n3. **Anomalies**: Anything unexpected?\n4. **Recommendations**: 3 actionable next steps based on the data\n5. **Limitations**: What can't we conclude from this data?\n\nUse plain language. Avoid jargon unless the audience is technical.",
        tags: ["data analysis", "insights", "decision making"]
    },
    {
        id: "a2", category: "analysis",
        title: "Research Synthesizer",
        prompt: "Synthesize the following research findings into a coherent summary.\n\nSources:\n[PASTE RESEARCH OR KEY FINDINGS]\n\nProvide:\n1. **Executive Summary** (3-4 sentences)\n2. **Key Themes** across all sources (with source references)\n3. **Areas of Agreement** between sources\n4. **Areas of Disagreement** or gaps\n5. **Implications** for [SPECIFIC FIELD/CONTEXT]\n6. **Further Research Needed**",
        tags: ["research", "synthesis", "literature review"]
    },

    // Education & Training
    {
        id: "e1", category: "education",
        title: "Socratic Tutor",
        prompt: "You are a Socratic tutor helping a student learn [TOPIC].\n\nRules:\n- NEVER give the answer directly\n- Ask one question at a time to guide the student's thinking\n- If the student is wrong, ask a hinting question rather than correcting them\n- If the student is right, ask a deeper follow-up question\n- Adjust difficulty based on the student's responses\n- Encourage the student when they make progress\n\nStart by asking the student what they already know about [TOPIC].",
        tags: ["teaching", "Socratic method", "tutoring"]
    },
    {
        id: "e2", category: "education",
        title: "Quiz Generator",
        prompt: "Create a quiz on [TOPIC] for [AUDIENCE LEVEL: beginner/intermediate/advanced].\n\nFormat:\n- 10 questions total\n- Mix of: 4 multiple choice, 3 true/false, 2 short answer, 1 scenario-based\n- Difficulty progression: easy to hard\n- Include an answer key with explanations\n- For multiple choice, include 4 options with plausible distractors\n- For the scenario, provide a real-world situation and ask for the best approach",
        tags: ["quiz", "assessment", "education"]
    },
    {
        id: "e3", category: "education",
        title: "Lesson Plan Builder",
        prompt: "Create a lesson plan for [TOPIC] targeting [AUDIENCE].\n\nDuration: [TIME]\n\nInclude:\n1. **Learning Objectives** (3 measurable objectives using Bloom's taxonomy verbs)\n2. **Hook/Warm-up** (5 minutes, engaging opener)\n3. **Core Content** (broken into 15-minute segments with transition prompts)\n4. **Activities** (at least 2: one individual, one group)\n5. **Assessment** (formative check for understanding)\n6. **Wrap-up** (key takeaways + preview of next session)\n7. **Materials Needed**\n8. **Differentiation** (adaptations for struggling and advanced learners)",
        tags: ["lesson planning", "curriculum", "teaching"]
    },

    // Creative & Design
    {
        id: "cr1", category: "creative",
        title: "Creative Brief Generator",
        prompt: "You are a creative director. Generate a creative brief for [PROJECT TYPE: campaign/branding/product launch].\n\nInclude:\n1. **Project Overview** (what and why)\n2. **Target Audience** (demographics, psychographics, pain points)\n3. **Key Message** (one sentence)\n4. **Tone & Voice** (3-5 adjectives)\n5. **Deliverables** (list with specifications)\n6. **Constraints** (budget, timeline, brand guidelines)\n7. **Success Metrics** (how will we measure impact)\n8. **Inspiration** (3 reference examples with what to learn from each)",
        tags: ["creative", "brief", "design"]
    },
    {
        id: "cr2", category: "creative",
        title: "UX Copy Writer",
        prompt: "You are a UX writer. Write microcopy for [SPECIFIC FLOW: onboarding/signup/error/checkout].\n\nFor each screen/step, provide:\n1. **Headline** (clear, benefit-focused, under 10 words)\n2. **Body copy** (supporting text, under 50 words)\n3. **CTA button text** (action-oriented, under 4 words)\n4. **Error states** (if applicable, friendly and helpful)\n5. **Empty states** (if applicable, encouraging and guiding)\n\nTone: [SPECIFY TONE]\nConstraints: [SPECIFY ANY CONSTRAINTS]",
        tags: ["UX", "microcopy", "user experience"]
    }
];

const Gallery = {
    currentCategory: 'all',

    init() {
        this.renderCategories();
        this.renderPrompts();
    },

    renderCategories() {
        const container = document.getElementById('gallery-categories');
        container.innerHTML = '';

        const allBtn = document.createElement('button');
        allBtn.className = `gallery-cat-btn ${this.currentCategory === 'all' ? 'active' : ''}`;
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', () => {
            this.currentCategory = 'all';
            this.renderCategories();
            this.renderPrompts();
        });
        container.appendChild(allBtn);

        GALLERY_CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `gallery-cat-btn ${this.currentCategory === cat.id ? 'active' : ''}`;
            btn.innerHTML = `${cat.icon} ${cat.name}`;
            btn.addEventListener('click', () => {
                this.currentCategory = cat.id;
                this.renderCategories();
                this.renderPrompts();
            });
            container.appendChild(btn);
        });
    },

    renderPrompts() {
        const container = document.getElementById('gallery-prompts');
        container.innerHTML = '';

        const filtered = this.currentCategory === 'all'
            ? GALLERY_PROMPTS
            : GALLERY_PROMPTS.filter(p => p.category === this.currentCategory);

        filtered.forEach(prompt => {
            const card = document.createElement('div');
            card.className = 'gallery-card';

            const tags = prompt.tags.map(t => `<span class="gallery-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="gallery-card-header">
                    <h3 class="gallery-card-title">${prompt.title}</h3>
                    <button class="btn btn-small btn-ghost copy-btn" data-id="${prompt.id}" title="Copy to clipboard">&#128203; Copy</button>
                </div>
                <div class="gallery-card-tags">${tags}</div>
                <div class="gallery-card-prompt">${this.escapeHtml(prompt.prompt)}</div>
            `;

            container.appendChild(card);
        });

        // Bind copy buttons
        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const prompt = GALLERY_PROMPTS.find(p => p.id === id);
                if (prompt) {
                    navigator.clipboard.writeText(prompt.prompt).then(() => {
                        this.showToast('Copied to clipboard!');
                        e.target.textContent = 'Done!';
                        setTimeout(() => { e.target.innerHTML = '&#128203; Copy'; }, 2000);
                    }).catch(() => {
                        this.showToast('Copy failed. Select and copy manually.');
                    });
                }
            });
        });
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }
};
