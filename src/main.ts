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
  UniversalCamera,
} from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";
import { PhysicsImpostor } from "@babylonjs/core";

import * as CANNON from "cannon";

import "./style.css";
import { BinaryFileAssetTask } from "babylonjs";
import { defaultFragmentDeclaration } from "babylonjs/Shaders/ShadersInclude/defaultFragmentDeclaration";

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
const recorder = new BABYLON.SceneRecorder();
recorder.track(scene);
recorder.getDelta();

const camera = new BABYLON.UniversalCamera(
  "camera",
  new BABYLON.Vector3(0, 0, -10),
  scene
);
//camera.setTarget(Vector3.Zero());
//camera.attachControl(canvas, true);

const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

/**
 * keyboard
 * https://doc.babylonjs.com/features/featuresDeepDive/scene/interactWithScenes
 */
let cameraW = false;
let cameraA = false;
let cameraS = false;
let cameraD = false;
let cameraQ = false;
let cameraE = false;
scene.onKeyboardObservable.add((kbInfo) => {
  // Camera Move
  switch (kbInfo.event.key) {
    case "w":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraW = true;
          break;
        case "keyup":
          cameraW = false;
          break;
        default:
          break;
      }
      break;
    case "a":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraA = true;
          break;
        case "keyup":
          cameraA = false;
          break;
        default:
          break;
      }
      break;
    case "d":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraD = true;
          break;
        case "keyup":
          cameraD = false;
          break;
        default:
          break;
      }
      break;
    case "s":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraS = true;
          break;
        case "keyup":
          cameraS = false;
          break;
        default:
          break;
      }
      break;
    case "q":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraQ = true;
          break;
        case "keyup":
          cameraQ = false;
          break;
        default:
          break;
      }
      break;
    case "e":
      switch (kbInfo.event.type) {
        case "keydown":
          cameraE = true;
          break;
        case "keyup":
          cameraE = false;
          break;
        default:
          break;
      }
      break;
    default:
      console.log(`nothing is assigned: ${kbInfo.event.key}`);
      break;
  }
});

const rotating_box = BABYLON.CreateBox("rotating_box");

scene.onBeforeRenderObservable.add(() => {
  rotating_box.rotation.x += 0.1;
  rotating_box.position.addInPlace(rotating_box.getDirection(camera.position));
});

/**
 * forwardに対するdirectionを求める
 * @param direction 進行方向
 * @param orientation 姿勢
 * @returns 姿勢に対する進行方向
 */
const getRelativeDirection = (direction: Vector3, orientation: Vector3) => {
  direction = direction.normalize();
  return BABYLON.Vector3.TransformCoordinates(
    direction,
    BABYLON.Matrix.RotationYawPitchRoll(
      orientation.y,
      orientation.x,
      orientation.z
    )
  );
};

scene.onBeforeRenderObservable.add(() => {
  const delta = engine.getDeltaTime() / 60;
  const direction = new Vector3();
  if (cameraW) {
    direction.addInPlace(
      getRelativeDirection(new Vector3(0, 0, 1), camera.rotation)
    );
  }
  if (cameraA) {
    direction.addInPlace(
      getRelativeDirection(new Vector3(-1, 0, 0), camera.rotation)
    );
  }
  if (cameraS) {
    direction.addInPlace(
      getRelativeDirection(new Vector3(0, 0, -1), camera.rotation)
    );
  }
  if (cameraD) {
    direction.addInPlace(
      getRelativeDirection(new Vector3(1, 0, 0), camera.rotation)
    );
  }

  const normalized_direction = direction.normalize();
  camera.position.x += normalized_direction.x * delta;
  camera.position.y += normalized_direction.y * delta;
  camera.position.z += normalized_direction.z * delta;

  if (cameraQ) {
    camera.rotation.y -= 0.1 * delta;
  }
  if (cameraE) {
    camera.rotation.y += 0.1 * delta;
  }
});

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
