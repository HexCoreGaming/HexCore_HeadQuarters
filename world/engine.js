
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // 3D ENGINE
// =====================================================

// SECTION 01 // CREATE SCENE

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080711);

// SECTION 02 // CREATE CAMERA

export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 8);

// SECTION 03 // CREATE RENDERER

export const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);

// SECTION 04 // WINDOW RESIZING

window.addEventListener("resize", () => {
    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// SECTION 05 // RENDER LOOP

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
