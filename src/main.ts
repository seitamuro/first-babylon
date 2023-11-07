import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core";

import "./style.css";

/**
 * Setup Scene , Camera and etc
 */
const canvas = document.querySelector(".webgl") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
