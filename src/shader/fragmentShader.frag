precision mediump float;

uniform float uTime;

varying float vRandom;

void main() {
  gl_FragColor = vec4(vRandom*abs(sin(uTime*2.0)), 1.0-vRandom, 1.0, 1.0);
}