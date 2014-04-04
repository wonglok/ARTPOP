/*http://threejs.org/examples/webgl_custom_attributes.html*/

//spike rate
uniform float amplitude;
//ball spike
attribute float displacement;

//make a varting normal
varying vec3 vNormal;
//make a varying UV mapping
varying vec2 vUv;

void main() {

	vNormal = normal;
	vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

	vec3 newPosition = position
						+ amplitude * 0.5
						* normal
						* vec3( displacement );

	gl_Position = projectionMatrix
						* modelViewMatrix
						* vec4( newPosition, 1.0 );

}













/**/