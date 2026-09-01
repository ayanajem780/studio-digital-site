import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const container = document.getElementById("andigital-3d");

if (!container) {
  console.warn("Le conteneur #andigital-3d est introuvable.");
} else {
  // --------------------------------
  // SCÈNE
  // --------------------------------
  const scene = new THREE.Scene();

  // --------------------------------
  // CAMÉRA
  // --------------------------------
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.z = 4.5;

  // --------------------------------
  // RENDERER
  // --------------------------------
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);

  // --------------------------------
  // LUMIÈRES
  // --------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const light1 = new THREE.PointLight(0xffffff, 4, 10);
  light1.position.set(3, 3, 4);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xffffff, 3, 10);
  light2.position.set(-3, -2, 2);
  scene.add(light2);

  // --------------------------------
  // FORME 3D
  // --------------------------------
  const geometry = new THREE.IcosahedronGeometry(1.35, 5);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.25,
    transmission: 0.15,
    thickness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.08
  });

  const shape = new THREE.Mesh(geometry, material);

  scene.add(shape);

  // --------------------------------
  // PARTICULES
  // --------------------------------
  const particleGeometry = new THREE.BufferGeometry();

  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 2.1 + Math.random() * 0.8;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.015,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
  );

  scene.add(particles);

  // --------------------------------
  // SOURIS
  // --------------------------------
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX =
      (event.clientX / window.innerWidth - 0.5) * 2;

    mouseY =
      (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // --------------------------------
  // ANIMATION
  // --------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Rotation principale
    shape.rotation.y = time * 0.25;
    shape.rotation.x = Math.sin(time * 0.35) * 0.15;

    // Réaction à la souris
    shape.rotation.y += mouseX * 0.15;
    shape.rotation.x += mouseY * 0.08;

    // Léger mouvement vertical
    shape.position.y =
      Math.sin(time * 0.7) * 0.08;

    // Particules
    particles.rotation.y = time * 0.05;
    particles.rotation.x = time * 0.025;

    renderer.render(scene, camera);
  }

  animate();

  // --------------------------------
  // RESPONSIVE
  // --------------------------------
  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }

  window.addEventListener("resize", resize);

  resize();
}
// TEXTE CIRCULAIRE AUTOUR DU BALLON
const orbitText = document.getElementById("heroOrbitText");

if (orbitText) {
    const text = "NOUS CRÉONS • DES EXPÉRIENCES • DIGITALES •";

    orbitText.textContent = "";

    const ring = document.createElement("div");
    ring.className = "hero-orbit-ring";

    orbitText.appendChild(ring);

    [...text].forEach((char, index) => {
        const span = document.createElement("span");

        span.className = "orbit-char";
        span.textContent = char === " " ? "\u00A0" : char;

        const angle = (index / text.length) * Math.PI * 2;
        const radius = 145;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        span.style.transform =
    `translate(-50%, -50%) translate(${x}px, ${y}px)`;

        ring.appendChild(span);
    });

    let rotation = 0;

function animateOrbit() {
    rotation += 0.08;

    const chars = ring.querySelectorAll(".orbit-char");

    chars.forEach((char, index) => {
        const angle =
            (index / text.length) * Math.PI * 2 +
            rotation * Math.PI / 180;

        const radius = 180;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        char.style.transform =
            `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animateOrbit);
}

animateOrbit();

}