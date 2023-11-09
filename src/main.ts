import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import {
  CannonJSPlugin,
  MeshBuilder,
  Mesh,
  StandardMaterial,
} from "@babylonjs/core";
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

/**
 * Create Meshes
 */
const ground = MeshBuilder.CreateBox(
  "ground",
  { width: 30, height: 1, depth: 30 },
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

interface BoxMesh extends Mesh {
  material: StandardMaterial;
}

const boxGroup: BoxMesh[] = [];
const tekito = 100;

for (let i = 0; i < 10; i++) {
  const box = MeshBuilder.CreateBox(`box`, { size: 2 }, scene) as BoxMesh;
  const boxMaterial = new StandardMaterial("boxMaterial", scene);
  box.material = boxMaterial;
  box.position.x = Math.random() * 20 - 5;
  box.position.y = 5 + Math.random() * 5;
  box.position.z = Math.random() * 20 - 5;
  box.rotate(new Vector3(1, 1, 1), Math.random() * Math.PI * 2);
  box.physicsImpostor = new PhysicsImpostor(
    box,
    PhysicsImpostor.BoxImpostor,
    { mass: 1, restitution: 0.9 },
    scene
  );
  boxGroup.push(box);
}

for (let box of boxGroup) {
  scene.onBeforeRenderObservable.add(() => {
    if (box.intersectsMesh(ground)) {
      box.material.diffuseColor = new Color3(1, 0, 0);
    } else {
      box.material.diffuseColor = new Color3(0.5, 0.5, 0.5);
    }

    for (let other_box of boxGroup) {
      if (other_box != box) {
        if (box.intersectsMesh(other_box)) {
          box.material.diffuseColor.b = 1;
        }
      }
    }
  });
}

/**
 * Render Loop
 */
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
