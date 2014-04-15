//http://threejs.org/examples/webgl_custom_attributes.html


uniform float amplitude;
uniform float textureShift;

attribute float displacement;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

	vNormal = normal;

	vUv =		  ( 0.5 + textureShift )
				* uv
			  +
			    vec2( textureShift );

	vec3 newPosition = 	  position
						+
						    amplitude
						  * normal
						  * vec3( displacement );

    gl_Position =     projectionMatrix
    				* modelViewMatrix
    				* vec4( newPosition, 1.0 );


}





























//