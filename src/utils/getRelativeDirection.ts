import { Vector3 } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";

/**
 * forwardに対するdirectionを求める
 * @param direction 進行方向
 * @param orientation 姿勢
 * @returns 姿勢に対する進行方向
 */
export const getRelativeDirection = (
  direction: Vector3,
  orientation: Vector3
) => {
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
