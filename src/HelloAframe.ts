import 'aframe';

// Initialize A-Frame scene
const scene = document.createElement('a-scene');
document.body.appendChild(scene);

// Add a box to the scene
const box = document.createElement('a-box');
box.setAttribute('position', '0 1.6 -3');
box.setAttribute('rotation', '0 45 0');
box.setAttribute('color', '#4CC3D9');
scene.appendChild(box);