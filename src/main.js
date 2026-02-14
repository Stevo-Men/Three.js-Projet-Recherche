import * as THREE from 'three';

// 1. La scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// 2. La caméra
// PerspectiveCamera(Champ de vision, Ratio, Distance Min, Distance Max)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Le rendu
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. L'objet
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. La boucle d'animation
function animate() {
  requestAnimationFrame(animate);

  // Animation du cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Ordre de dessiner
  renderer.render(scene, camera);
}

// Lancer la boucle
animate();

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});