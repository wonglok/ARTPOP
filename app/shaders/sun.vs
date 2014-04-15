//http://localhost:3000/Three.js/index.html#textures
varying vec2 vUv;
void main()
{
	//varying uv mapping
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}