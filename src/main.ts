import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { CannonJSPlugin, MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { PhysicsImpostor } from "@babylonjs/core";

import * as CANNON from "cannon";

import "./style.css";

/**
 * Setup Scene , Camera and etc
 */
const canvas = document.querySelector(".webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
scene.enablePhysics(
  new Vector3(0, -9.81, 0),
  new CannonJSPlugin(true, 10, CANNON)
);

const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const ground = MeshBuilder.CreateBox(
  "ground",
  { width: 10, height: 1, depth: 10 },
  scene
);
ground.position.y = -2;
const groundMaterial = new StandardMaterial("groundMaterial", scene);
groundMaterial.diffuseColor = new Color3(1, 0, 0);
ground.material = groundMaterial;
ground.physicsImpostor = new PhysicsImpostor(
  ground,
  PhysicsImpostor.BoxImpostor,
  { mass: 0, restitution: 0.2 },
  scene
);

const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
box.position.y = 1;
box.physicsImpostor = new PhysicsImpostor(
  box,
  PhysicsImpostor.BoxImpostor,
  { mass: 1, restitution: 0.2 },
  scene
);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
