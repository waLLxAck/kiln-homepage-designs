// PROTOTYPE 14 — Web 1.0. A plain documentation page, the way a sysadmin would write one about a program they made.
import './style.css';
import { examples, installer } from '../../content';

const faq: [string, string, string][] = [
  ['cost', 'What does it cost to run?', 'Kiln itself is MIT licensed. It runs your existing Codex or Claude Code, so tests use your ChatGPT or Claude subscription. There is no API key to set up and no separate API bill. Your subscription’s usage limits still apply, and a long test run uses them like any other session would.'],
  ['key', 'Do I need an API key?', 'No. Kiln talks to the Codex or Claude Code program that is already installed and signed in on your machine.'],
  ['agents', 'Which agents does it work with?', 'Tests run through <b>Codex</b> or <b>Claude Code</b>. Skills can be installed into Codex, Claude Code and <b>Copilot</b> locations, personal or per project. Custom agent definitions are kept in each tool’s native format.'],
  ['code', 'Will a test change my code?', 'No. Experiments are read-only. The agent can read the repository, run commands that inspect it and search the web, but it does not edit files. If the task you gave it really needs edits, or a tool it cannot use, the result comes back as <i>uncertain</i> instead of a pretend success.'],
  ['verdict', 'Who decides whether a prompt worked?', 'You do. The agent gives its own assessment (pass, fail or uncertain) and Kiln saves it with the output against the exact revision you ran. Your judgement is recorded separately. I did it this way because the agent grading its own homework is useful, but it is not the same thing as you reading the output.'],
  ['watch', 'What do I see while a test runs?', 'Messages, reasoning summaries, commands, web searches, the model, the reasoning effort, elapsed time and token counts (input, cached and output), live. You can run two at once, cancel one, or retry.'],
  ['os', 'Does it run on macOS or Linux?', 'No. It is a Windows desktop program. There is a command-line tool as well, but it is part of the same Windows install.'],
  ['offline', 'Does it work offline or without an account?', 'No. The library is stored locally, but it is backed by a GitHub repository that Kiln creates for you during setup, using the official <code>gh</code> tool. Tests need your agent, and your agent needs the internet.'],
  ['sent', 'What gets sent to a model, and when?', 'Only when you ask for something that needs one: running an experiment, <i>Ask the agent</i>, <i>Analyze and add</i>, <i>Distill video</i> or <i>Create skill</i>. A consent notice explains what is sent before the first agent interaction. Saving, editing, organising, approving and installing never call a model.'],
  ['tokens', 'Does Kiln tell me how many tokens each skill costs?', 'No, and I would rather say so than fake it. Each test run shows its token usage. For skills, Kiln shows exactly which copies are installed where. That matters because the description of every model-invoked skill sits in the agent’s context on every turn, so forgotten and duplicate copies cost tokens and attention even when they never fire. The fix is to see them and remove the ones you don’t use.'],
  ['folders', 'What happens to my existing skill folders?', 'Nothing, unless you ask. <i>Import</i> brings installed skills or a skills repository in as drafts, and the originals stay where they are. <i>Find skills and agents not in the library</i> scans the usual locations. The only cleanup it offers on its own is removing broken links and empty folders. <i>Remove local copies</i> is a separate, deliberate action: copies Kiln installed are deleted, anything else is moved to a private backup first.'],
  ['drift', 'What does “edited outside Kiln” mean?', 'Someone (usually me) edited an installed copy by hand after Kiln installed it. Kiln calls that drift and lets you compare the installed copy file by file with the approved version. Other states you will see: <i>installed</i>, <i>identical copy found</i>, <i>differs</i> and <i>linked</i>.'],
  ['approve', 'What does approving a skill actually do?', 'It pins one exact revision. Kiln commits and publishes that snapshot to your own Kiln repository on GitHub, in a standard layout, after validation that never executes the skill. Editing afterwards creates a new draft and never replaces what you approved. Installs always use approved content. There is no automatic approval.'],
  ['machine', 'How do I get my skills on another computer?', 'Install Kiln there, open your Kiln repository, and press <i>Install everything marked for this machine</i>. From a terminal: <code>kiln skills sync</code>.'],
  ['hooks', 'Will it run my hooks?', 'No. The config editor opens hooks files so you can edit them, but Kiln never executes hooks.'],
  ['video', 'Can it do anything with YouTube videos?', 'Paste a link to a captioned video and press <i>Distill video</i>. The captions become a collection of reusable entries (prompts, techniques, insights, tools), each with a timestamped link back to the moment it came from. The transcript stays attached.'],
  ['download', 'Why can’t I download it?', 'The release lives in a private GitHub repository. You need to be signed in to GitHub with an account that has access. If the link gives you a 404, that is almost certainly why.'],
  ['warning', 'Why does Windows warn me about the installer?', 'The builds are not code-signed yet, so Windows SmartScreen does not recognise them. That is expected. Only run it if you got the link from the repository.'],
];

const limits = [
  'Windows only.',
  'Not offline, and not account-free: it needs GitHub (through <code>gh</code>) and a signed-in Codex or Claude Code.',
  'Tests are read-only. It will not fix your code for you during an experiment.',
  'Two experiments at a time, at most.',
  'Subscription usage limits still apply to every run.',
  'No per-skill token cost. Token counts are per run.',
  'Nothing is approved automatically. Nothing is deployed to remote servers.',
  'Installers are unsigned.',
];

const changes = [
  ['0.17.0', 'Protect approved publishing and private agent sessions.', true],
  ['0.16.0', 'Focused CLI discovery and batch reads.', false],
  ['0.15.0', 'Better reading, navigation, capture and quick search.', false],
  ['0.14.0', 'Analyze every capture into reusable entries.', false],
] as const;

export function render(root: HTMLElement) {
  document.title = 'Kiln: a Windows program that tests the prompts you save and keeps track of your skills';
  const ex = examples[0];
  root.innerHTML = `
<div class="v14" id="v14-top">
<header>
<h1>Kiln</h1>
<p class="v14-sub"><b>A Windows program that tests the prompts you save and keeps track of your skills.</b></p>
<p class="v14-meta">Last updated: 24 September 2026. Current version: <a href="#v14-changes">0.17.0</a>. <a href="#v14-download">Download</a>.</p>
</header>
<hr>
<main id="main">
<nav aria-labelledby="v14-toc">
<h2 id="v14-toc">Contents</h2>
<ol>
<li><a href="#v14-what">What is this?</a></li>
<li><a href="#v14-why">Why I wrote it</a></li>
<li><a href="#v14-does">What it does</a>
  <ol><li><a href="#v14-testing">Testing a prompt</a></li><li><a href="#v14-library">The library</a></li><li><a href="#v14-copies">Seeing every copy</a></li><li><a href="#v14-versions">Versions and approval</a></li><li><a href="#v14-config">Config files</a></li></ol></li>
<li><a href="#v14-download">Download</a></li>
<li><a href="#v14-req">Requirements</a></li>
<li><a href="#v14-install">Installing and first run</a></li>
<li><a href="#v14-faq">Frequently asked questions</a></li>
<li><a href="#v14-limits">Known limitations</a></li>
<li><a href="#v14-cli">Command line</a></li>
<li><a href="#v14-changes">Changes</a></li>
<li><a href="#v14-licence">Licence</a></li>
</ol>
</nav>
<hr>

<h2 id="v14-what">1. What is this?</h2>
<p>Kiln is a desktop program for Windows for people who use coding agents (Codex, Claude Code, and Copilot for installs). It does two things:</p>
<ol>
<li>It lets you <b>test a prompt you saved</b> on one of your own repositories, straight away, and keeps the result.</li>
<li>It keeps <b>one library</b> of your prompts, skills and custom agents, and shows you where every installed copy of a skill lives and whether anyone changed it.</li>
</ol>
<p>That is most of it. The rest of this page is detail.</p>

<h2 id="v14-why">2. Why I wrote it</h2>
<p>I had a text file called <code>prompts-to-try.txt</code>. It only ever got longer. I also had the same code-review skill in <code>~/.claude/skills</code>, in <code>~/.agents/skills</code> and in two projects, all slightly different, and I could not have told you which one my agent was reading.</p>
<p>So I wrote a program that makes trying a prompt cheaper than bookmarking it, and that keeps track of the skills I end up with.</p>

<h2 id="v14-does">3. What it does</h2>

<h3 id="v14-testing">3.1 Testing a prompt</h3>
<p>Capture something (paste or drop text, a link, a screenshot or a file; <kbd>Ctrl</kbd>+<kbd>N</kbd>, or the tray icon). Pick a local repository, or an isolated example if you don't want to point it at real code. Press run. Kiln sends the exact revision of the prompt to your signed-in Codex or Claude Code and shows you what happens, live.</p>
<p>Here is a real prompt from my library, shortened:</p>
<blockquote><p>${ex.prompt}</p></blockquote>
<p>A test of that looks roughly like this (the numbers are made up for this page):</p>
<pre class="v14-pre" aria-label="Sample experiment summary">Experiment   ${ex.title}, revision 2
Repository   game (read-only)
Agent        Claude Code, reasoning effort: high
Elapsed      4m 10s                                  <i>sample</i>
Tokens       41,200 in / 28,900 cached / 2,300 out    <i>sample</i>
Agent says   PASS
You say      (not decided yet)</pre>
<p>If the output is not what you wanted, edit the prompt, compare the two revisions with a diff, and run it again on the same repository. That loop is the whole point: you see which change made the difference. When a prompt keeps working, <i>Create skill</i> drafts a <code>SKILL.md</code> from it, using some bundled guidance on writing for agents, and links it back to where it came from.</p>
<p>Other ways in: <i>Save only</i> keeps a capture without calling a model. <i>Analyze and add</i> turns a source into prompts, insights, techniques and tools in a collection. <i>Distill video</i> does the same for a captioned YouTube video, with timestamped links. <i>Ask the agent</i> discusses an item with its attachments and source.</p>

<h3 id="v14-library">3.2 The library</h3>
<p>Prompts, skills, custom agent definitions (native Codex, Claude Code and Copilot formats), source notes, insights, techniques, tools and resources, all in one list. You get:</p>
<ul>
<li>collections, tags, favourites and search (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> works from anywhere in Windows);</li>
<li>filters by kind, status, provider, location, copy state, scope and tag;</li>
<li>bulk selection with Ctrl-click, Shift-click and <kbd>Ctrl</kbd>+<kbd>A</kbd>;</li>
<li>archive, trash, restore, swipe to archive, and undo.</li>
</ul>

<h3 id="v14-copies">3.3 Seeing every copy</h3>
<p>Skills are folders, and folders get copied. For each skill, Kiln lists every installed copy across your personal locations and the projects you have enrolled, with a state:</p>
<div class="v14-scroll">
<table class="v14-table">
<caption>Example: one skill, three copies</caption>
<thead><tr><th scope="col">Location</th><th scope="col">Path</th><th scope="col">State</th></tr></thead>
<tbody>
<tr><td>Codex and others</td><td><code>~/.agents/skills/code-review</code></td><td>installed</td></tr>
<tr><td>Claude Code</td><td><code>~/.claude/skills/code-review</code></td><td><b>edited outside Kiln</b></td></tr>
<tr><td>game project</td><td><code>.github/skills/code-review</code></td><td>installed</td></tr>
</tbody>
</table>
</div>
<p>Possible states are <i>installed</i>, <i>identical copy found</i>, <i>differs</i>, <i>linked</i> and <i>edited outside Kiln</i>. You can compare an installed copy file by file with the approved version, and remove local copies in bulk. Each install leaves a receipt with the revision and destination.</p>

<h3 id="v14-versions">3.4 Versions and approval</h3>
<p>Every edit is a revision, with a diff. Approving pins one exact revision, and Kiln commits and publishes it to <b>your own</b> Kiln repository on GitHub. Editing again makes a new draft; the approved revision stays approved until you approve something else. Installs only ever use approved content. Git status, sync and conflict resolution are built in.</p>

<h3 id="v14-config">3.5 Config files</h3>
<p>One screen for the files you keep forgetting the location of:</p>
<div class="v14-scroll">
<table class="v14-table">
<tbody>
<tr><th scope="row">Instructions</th><td><code>CLAUDE.md</code>, <code>AGENTS.md</code></td></tr>
<tr><th scope="row">Codex</th><td><code>config.toml</code>, <code>hooks.json</code></td></tr>
<tr><th scope="row">Claude Code</th><td>settings, permissions, hooks</td></tr>
<tr><th scope="row">Copilot</th><td>settings</td></tr>
<tr><th scope="row">Other</th><td>MCP config, VS Code settings, shell profiles</td></tr>
</tbody>
</table>
</div>
<p>Edits happen in place, with syntax validation. Kiln keeps 30 private backups per file, shows a diff before you restore one, and tells you if the file changed on disk while you were editing it. It never executes hooks.</p>

<h2 id="v14-download">4. Download</h2>
<table class="v14-table v14-dl">
<tbody>
<tr><th scope="row">File</th><td><a href="${installer}">Kiln.Setup.0.17.0.exe</a> <span class="v14-new">NEW</span></td></tr>
<tr><th scope="row">Version</th><td>0.17.0</td></tr>
<tr><th scope="row">For</th><td>Windows (desktop app and CLI)</td></tr>
<tr><th scope="row">Signed</th><td>No</td></tr>
</tbody>
</table>
<p><b>Note:</b> the release is hosted in a <b>private</b> GitHub repository. You must be signed in to GitHub with an account that has access, or the link will not work.</p>

<h2 id="v14-req">5. Requirements</h2>
<ul>
<li>Windows.</li>
<li>Codex or Claude Code, installed and signed in (a ChatGPT or Claude subscription).</li>
<li>A GitHub account, and the official <code>gh</code> command-line tool. Kiln uses it to create the repository behind your library.</li>
<li>Access to the private release repository, for the download.</li>
</ul>

<h2 id="v14-install">6. Installing and first run</h2>
<ol>
<li>Download the installer from <a href="#v14-download">section 4</a> and run it. SmartScreen may complain because it is unsigned.</li>
<li>Read the consent notice. It says what gets sent to your agent, and when.</li>
<li>Let Kiln create your library repository on GitHub through <code>gh</code>.</li>
<li>Import the skills you already have. They come in as drafts; your folders are not touched.</li>
<li>Save a prompt and test it on a repository. That is the part worth doing first.</li>
</ol>

<h2 id="v14-faq">7. Frequently asked questions</h2>
<ul class="v14-faq-index">${faq.map(([id, q]) => `<li><a href="#v14-q-${id}">${q}</a></li>`).join('')}</ul>
<dl class="v14-faq">${faq.map(([id, q, a]) => `<dt id="v14-q-${id}">Q. ${q}</dt><dd>A. ${a}</dd>`).join('')}</dl>

<h2 id="v14-limits">8. Known limitations</h2>
<p>Things Kiln does not do, so you do not have to find out the hard way:</p>
<ul>${limits.map(l => `<li>${l}</li>`).join('')}</ul>

<h2 id="v14-cli">9. Command line</h2>
<p>The <code>kiln</code> command scripts collections, items, experiments, approvals and installs, and prints JSON to stdout. Your agents can use it to read your library. A few examples:</p>
<pre class="v14-pre">kiln collections list
kiln items list --collection "Game design" --query playtest
kiln items read &lt;id&gt; --full
kiln skills sync        <i># install everything marked for this machine</i>
kiln deploy drift       <i># find installed copies edited outside Kiln</i>
kiln home list          <i># the config files Kiln knows about</i></pre>
<p>Run <code>kiln</code> with no arguments for the full list.</p>

<h2 id="v14-changes">10. Changes</h2>
<table class="v14-table v14-changes">
<thead><tr><th scope="col">Version</th><th scope="col">What changed</th></tr></thead>
<tbody>${changes.map(([v, text, isNew]) => `<tr><td>${v}${isNew ? ' <span class="v14-new">NEW</span>' : ''}</td><td>${text}</td></tr>`).join('')}</tbody>
</table>

<h2 id="v14-licence">11. Licence</h2>
<p>MIT. Do what you like with it; there is no warranty.</p>
</main>
<hr>
<footer>
<p><a href="#v14-top">Back to top</a></p>
<p class="v14-meta">This page is plain HTML on purpose. If something on it is wrong, treat that as a bug in the program too.</p>
</footer>
</div>`;
}
