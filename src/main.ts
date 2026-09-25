// Routes `<base>/` to the index and `<base>/NN/` to design NN. Every design is a full page load, so its styles never mix with another's.
import './fonts.css';
import './fonts/fonts.css';
import { designs, renderDesign } from './designs';

const root = document.querySelector<HTMLDivElement>('#app')!;
const route = location.pathname.slice(import.meta.env.BASE_URL.length).replace(/\/+$/, '');
const design = designs.find(item => item.number === route || `${item.number}-${item.slug}` === route);

if (design) {
  renderDesign(design, root).then(() => import('./nav')).then(module => module.mountNav(design));
} else {
  import('./index-page').then(module => module.render(root));
}
