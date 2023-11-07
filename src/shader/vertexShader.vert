uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main() {
  vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
  modelPosition.z += aRandom * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  vRandom = aRandom;
  gl_Position = projectedPosition;
}