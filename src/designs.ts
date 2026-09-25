/// <reference types="vite/client" />
// The catalogue: every design folder in ./v/NN-slug/ (meta.ts, index.ts, styles), grouped into the five rounds of feedback.

export type Meta = { name: string; angle: string; focus: 'library' | 'testing' | 'both' };
export type Design = Meta & { number: string; slug: string };
type Module = { render: (root: HTMLElement) => void };

const metas = import.meta.glob<{ meta: Meta }>('./v/[0-9][0-9]-*/meta.ts', { eager: true });
const loaders = import.meta.glob<Module>('./v/[0-9][0-9]-*/index.ts');
const folder = (path: string) => path.split('/')[2];

export const designs: Design[] = Object.entries(metas)
  .map(([path, module]) => ({ number: folder(path).slice(0, 2), slug: folder(path).slice(3), ...module.meta }))
  .sort((a, b) => a.number.localeCompare(b.number));

export const rounds = [
  { from: 1, to: 3, title: 'Three directions', brief: 'The first ask: overhaul the Kiln homepage and give me three unique designs to cycle through.' },
  { from: 4, to: 53, title: 'Fifty, all different', brief: 'Fifty more, nothing close to what came before: new layouts, palettes, type and animation, and new ways to sell Kiln’s two ideas. Your skills stop being loose folders. And the prompt you saved for later gets tested on your repo today.' },
  { from: 54, to: 56, title: 'Which story goes first?', brief: 'The favourites shared a hand-drawn mess set against crisp product UI, and something to touch. One kit, three story orders: the skills library first, testing first, or both at once.' },
  { from: 57, to: 66, title: 'Ten takes on one theme', brief: 'The theme stuck, so explore it sideways: napkin, pencil and eraser, sticky notes, a comic, red pen, chalk, a bullet journal, a whiteboard, crayon and ink wash.' },
  { from: 67, to: 73, title: 'Two problems, told apart', brief: 'A fixed storyline. Open on “My agents were loading skills I forgot I had.” Act one: skill folders from every agent pop into one panel. Act two: “How do I add new skills?” Drag in a video, a post or a repo, test the prompt it becomes, approve it onto that panel. Four favourites reworked, three new.' },
  { from: 74, to: 74, title: 'The one that shipped', brief: 'The red-pen story from 70, the colours and editors from 71, the draggable phone from 67 and the tidy-up motion from 69, combined into the page Kiln now uses.' },
];

export const roundOf = (design: Design) => rounds.find(round => +design.number >= round.from && +design.number <= round.to)!;

export async function renderDesign(design: Design, root: HTMLElement) {
  const path = Object.keys(loaders).find(candidate => folder(candidate).startsWith(design.number + '-'))!;
  (await loaders[path]()).render(root);
}
