import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertexShader.vert";
import fragmentShader from "./shader/fragmentShader.frag";
import "./style.css";

/**
 * Setup Scene , Camera and etc
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector(".webgl") as HTMLCanvasElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
scene.add(camera);

/**
 * Geometry
 */
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
const count = geometry.attributes.position.count;

const aRandom = new Float32Array(count);
for (let i = 0; i < count; i++) {
  aRandom[i] = Math.random();
}
geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 1));

const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: { uTime: { value: 0.0 } },
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Animation
 */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
