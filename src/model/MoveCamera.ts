import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";
import { getRelativeDirection } from "../utils/getRelativeDirection";

type OptionalMoveCameraParams = {
  position?: Vector3;
  move_speed?: number;
  rotate_speed?: number;
};

enum Key {
  W,
  A,
  S,
  D,
  Q,
  E,
}

export class MoveCamera {
  camera: BABYLON.UniversalCamera;
  move_speed: number;
  rotate_speed: number;

  constructor(
    scene: BABYLON.Scene,
    engine: BABYLON.Engine,
    {
      position = new Vector3(),
      move_speed = 1.0,
      rotate_speed = 0.1,
    }: OptionalMoveCameraParams
  ) {
    this.camera = new BABYLON.UniversalCamera("move_camera", position, scene);

    this.move_speed = move_speed;
    this.rotate_speed = rotate_speed;

    // Key Observable
    const pressed_key: Set<Key> = new Set();
    scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.event.type) {
        case "keydown":
          switch (kbInfo.event.key) {
            case "w":
              pressed_key.add(Key.W);
              break;
            case "a":
              pressed_key.add(Key.A);
              break;
            case "s":
              pressed_key.add(Key.S);
              break;
            case "d":
              pressed_key.add(Key.D);
              break;
            case "q":
              pressed_key.add(Key.Q);
              break;
            case "e":
              pressed_key.add(Key.E);
              break;
            default:
              break;
          }
          break;

        case "keyup":
          switch (kbInfo.event.key) {
            case "w":
              pressed_key.delete(Key.W);
              break;
            case "a":
              pressed_key.delete(Key.A);
              break;
            case "s":
              pressed_key.delete(Key.S);
              break;
            case "d":
              pressed_key.delete(Key.D);
              break;
            case "q":
              pressed_key.delete(Key.Q);
              break;
            case "e":
              pressed_key.delete(Key.E);
              break;
            default:
              break;
          }
        default:
          break;
      }
    });

    // Update camera position and rotation
    scene.onBeforeRenderObservable.add(() => {
      const delta = engine.getDeltaTime();
      const direction = new Vector3();

      if (pressed_key.has(Key.W)) {
        direction.addInPlace(
          getRelativeDirection(new Vector3(0, 0, 1), this.camera.rotation)
        );
      }
      if (pressed_key.has(Key.A)) {
        direction.addInPlace(
          getRelativeDirection(new Vector3(-1, 0, 0), this.camera.rotation)
        );
      }
      if (pressed_key.has(Key.S)) {
        direction.addInPlace(
          getRelativeDirection(new Vector3(0, 0, -1), this.camera.rotation)
        );
      }
      if (pressed_key.has(Key.D)) {
        direction.addInPlace(
          getRelativeDirection(new Vector3(1, 0, 0), this.camera.rotation)
        );
      }

      const normalized_direction = direction.normalize();
      this.camera.position.addInPlace(
        normalized_direction.scale(delta * this.move_speed)
      );

      if (pressed_key.has(Key.Q)) {
        this.camera.rotation.y -= this.rotate_speed * delta;
      }
      if (pressed_key.has(Key.E)) {
        this.camera.rotation.y += this.rotate_speed * delta;
      }
    });
  }
}
