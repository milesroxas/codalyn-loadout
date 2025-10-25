import { initCarousel } from './features/carousel';
import { greetUser } from './utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  greetUser('MILES');
  initCarousel();
});
