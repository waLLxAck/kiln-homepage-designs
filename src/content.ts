// PROTOTYPE: shared, verified product content for the redesign variants. Claims mirror the current homepage and root README.
export const installer = 'https://github.com/waLLxAck/Kiln/releases/download/v0.17.0/Kiln.Setup.0.17.0.exe';
export const releaseNote = 'Kiln 0.17.0 for Windows. The release is in a private GitHub repository, so sign in with an account that has access.';
export const windowsMark = '<svg class="windows-mark" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M1 4.3 10.5 3v8H1zm11-1.5L23 1.3V11H12zM1 12.5h9.5v8L1 19.2zm11 0h11v9.7l-11-1.5z"/></svg>';
export const subscription = { title: 'You already pay for the agent.', text: 'Kiln uses your ChatGPT or Claude subscription through the signed-in Codex or Claude Code app on your machine. No separate API key. No extra API bill.', fine: 'Your subscription’s usage limits still apply.' };

export const steps = [
  { key: 'capture', title: 'Capture anything', short: 'Capture', text: 'Drop in a screenshot, paste a post from X, add a YouTube video, or save any idea that sparks your interest.' },
  { key: 'prompt', title: 'Turn it into a prompt', short: 'Prompt', text: 'Shape the idea into a clear, practical prompt you can run and iterate on with your own codebase.' },
  { key: 'test', title: 'Test it on your repo', short: 'Test', text: 'Choose a local repo and run the prompt through Codex or Claude Code. Experiments inspect your code read-only and save the output with that revision. Adjust and run again.' },
  { key: 'skill', title: 'Approve it as a skill', short: 'Skill', text: 'When it works, draft a skill, approve the exact revision you trust, and install it into compatible Codex, Claude Code or Copilot locations.' },
];

export const features = [
  { title: 'Collect the raw material', does: 'Save text, links, screenshots and files. Distill captioned YouTube videos into prompts, techniques, tools and insights.', keeps: 'The transcript and timestamped source links, kept with every entry.' },
  { title: 'Find the version worth keeping', does: 'Edit prompts, compare revisions and group related work in collections. Search, tags and favorites narrow the library.', keeps: 'Every revision, so an edit becomes a new draft instead of overwriting.' },
  { title: 'Test where it matters', does: 'Run a prompt against a local repository through Codex or Claude Code. Experiments inspect the code read-only.', keeps: 'The output and its limitations, attached to the revision you ran.' },
  { title: 'Install what you reviewed', does: 'Draft a skill from a useful prompt, approve it, and install it for your projects.', keeps: 'An approval tied to the exact revision, published to your Kiln GitHub repository.' },
  { title: 'Look after your config files', does: 'Open personal and project agent config files in one place and edit the actual file.', keeps: '30 private backups per file, with syntax checks and a diff before you restore.' },
];

export const examples = [
  { source: 'From a YouTube talk', title: 'Try it as a seven-year-old', idea: 'A fresh pair of eyes for the app you know too well.', prompt: 'Use this app as a seven-year-old. Skip the parent-only signup. Try different activities until you hit something confusing or cannot tell what to do next. Describe that first obstacle and suggest a fix. Make no changes yet.', skill: 'A usability check that catches what experienced users overlook.' },
  { source: 'From an agent workflow video', title: 'Find the instruction that went wrong', idea: 'When the agent does exactly what you didn’t mean.', prompt: 'You did X, but I expected Y. Trace the decision to instructions, messages, files or assumptions. Check AGENTS.md and CLAUDE.md for outdated guidance. Explain the cause and propose the smallest instruction change. Don’t edit anything yet.', skill: 'A way to fix recurring misunderstandings at their source.' },
  { source: 'From a saved prompt', title: 'Playtest for what kills the fun', idea: 'Put that game project through a player’s eyes.', prompt: 'Playtest this game. Find bugs, annoyances, confusing details and things that take away the fun. Look for quick wins and worthwhile additions. Rank the ten most impactful improvements, explain why each helps, and give me a list to review. Make no changes.', skill: 'A repeatable playtest brief for your next game build.' },
];

export const worries = [
  { question: 'Where did I save that?', answer: 'Give related work a home in collections. Prompts, skills, source notes and custom agents sit together, and search, tags, favorites and filters narrow the library. Import installed skills or an existing skills repository as drafts; the original files stay where they are.' },
  { question: 'Was this the version that worked?', answer: 'Kiln keeps the revision, its experiment and your approval connected. Edit it again and you get a new draft; the approved version keeps its identity. Approval commits and publishes the exact reviewed snapshot to your own GitHub repository.' },
  { question: 'What did that config change break?', answer: 'See personal and project config files in one place. Edit the real file, compare it with a previous version, and restore a backup. Kiln keeps 30 private backups and notices files changed on disk while you edit.' },
  { question: 'Which project has which copy?', answer: 'See where each skill is installed and whether a copy changed outside Kiln. Compare the difference, install an approved revision into a project, or remove a copy and keep your library.' },
  { question: 'Where in that hour-long video was it?', answer: 'Distill a captioned YouTube video into prompts, techniques, tools and insights. The transcript and timestamped links stay attached, so an idea keeps its explanation.' },
];

export const provenance = [
  { event: 'Imported', detail: 'Brought in from an existing skills folder as a draft for review.', state: 'Draft' },
  { event: 'Revised', detail: 'Reviews standards and the specification separately.', state: 'Revision 2' },
  { event: 'Tested', detail: 'Experiment on revision 2: output and assessment kept for review.', state: 'Evidence' },
  { event: 'Approved', detail: 'Revision 2 committed and published to my-kiln on GitHub.', state: 'Approved' },
  { event: 'Revised again', detail: 'Added guidance for generated files. The approval stays with revision 2.', state: 'Needs review' },
];

export const installs = [
  { agent: 'Agents', path: '~/.agents/skills/code-review', state: 'Installed', ok: true },
  { agent: 'Claude Code', path: '~/.claude/skills/code-review', state: 'Edited outside Kiln', ok: false },
  { agent: 'Game project', path: '.github/skills/code-review', state: 'Installed', ok: true },
];

export const collections = [
  { name: 'Agent workflows', items: [['Prompt', 'Find the instruction behind an unwanted decision'], ['Technique', 'Keep project memory specific'], ['Prompt', 'Get a repository and recent-PR briefing']] },
  { name: 'Game design', items: [['Prompt', 'Playtest for what takes away the fun'], ['Prompt', 'Build a risk-first prototype plan'], ['Insight', 'Judge variety by player decisions']] },
  { name: 'Skills to refine', items: [['Skill', 'Code review'], ['Skill', 'Research'], ['Skill', 'Writing for agents']] },
];
