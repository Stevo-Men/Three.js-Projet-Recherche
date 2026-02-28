
import './style.css';
import { initPresentation } from './presentation.js';

const app = document.querySelector('#app');
app.innerHTML = `<div id="main-container"></div>`;

initPresentation(document.querySelector('#main-container'));

