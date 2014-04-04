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
	vec2 amplitudeVec2 = vec2( amplitude, amplitude );
	
	vNormal = normal;
	vUv = ( 1.0 + amplitude ) * uv + vec2( amplitude, amplitude );
	
	vec3 newVertexPosition = position
								+ amplitude * 0.5
								* normal
								* vec3( displacement );

	gl_Position = projectionMatrix
						* modelViewMatrix
						* vec4( newVertexPosition, 1.0 );

}













/**/