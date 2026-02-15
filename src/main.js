
import './style.css';
import { initGallery } from './gallery3d.js';

document.querySelector('#app').innerHTML = `
  <div id="main-container"></div>
`;

// Initialize the 3D Gallery
initGallery(document.querySelector('#main-container'));
