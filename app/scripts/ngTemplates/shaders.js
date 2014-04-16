angular.module('artpopApp').run(['$templateCache', function($templateCache) {  'use strict';

  $templateCache.put('shaders/spiky.fs',
    "//http://threejs.org/examples/webgl_custom_attributes.html\n" +
    "\n" +
    "varying vec3 vNormal;\n" +
    "varying vec2 vUv;\n" +
    "\n" +
    "uniform vec3 color;\n" +
    "uniform sampler2D texture;\n" +
    "\n" +
    "void main() {\n" +
    "\tvec3 light = vec3( 0.5, 0.2, 1.0 );\n" +
    "\n" +
    "\t//lambertian\n" +
    "\tlight = normalize( light );\n" +
    "\tfloat dProd = dot( vNormal, light ) * 0.5\n" +
    "\t\t\t\t\t+ 0.5;\n" +
    "\n" +
    "\tvec4 tcolor = texture2D( texture, vUv );\n" +
    "\n" +
    "\tvec4 gray = vec4(\n" +
    "\t\t\t\t\t\tvec3(\n" +
    "\t\t\t\t\t\t\ttcolor.r * 0.5 +\n" +
    "\t\t\t\t\t\t\ttcolor.g * 0.59 +\n" +
    "\t\t\t\t\t\t\ttcolor.b * 0.11\n" +
    "\t\t\t\t\t\t)\n" +
    "\t\t\t\t\t,\n" +
    "\t\t\t\t\t\t1.0\n" +
    "\t\t\t\t);\n" +
    "\n" +
    "\tgl_FragColor =  gray\n" +
    "\t\t\t\t\t*\n" +
    "\t\t\t\t\tvec4(\n" +
    "\t\t\t\t\t\t  vec3( dProd )\n" +
    "\t\t\t\t\t\t* vec3( color )\n" +
    "\t\t\t\t\t,\n" +
    "\t\t\t\t\t\t1.0\n" +
    "\t\t\t\t\t);\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "//"
  );


  $templateCache.put('shaders/spiky.vs',
    "//http://threejs.org/examples/webgl_custom_attributes.html\n" +
    "\n" +
    "\n" +
    "uniform float amplitude;\n" +
    "uniform float textureShift;\n" +
    "\n" +
    "attribute float displacement;\n" +
    "\n" +
    "varying vec3 vNormal;\n" +
    "varying vec2 vUv;\n" +
    "\n" +
    "void main() {\n" +
    "\n" +
    "\tvNormal = normal;\n" +
    "\n" +
    "\tvUv =\t\t  ( 0.5 + textureShift )\n" +
    "\t\t\t\t* uv\n" +
    "\t\t\t  +\n" +
    "\t\t\t    vec2( textureShift );\n" +
    "\n" +
    "\tvec3 newPosition = \t  position\n" +
    "\t\t\t\t\t\t+\n" +
    "\t\t\t\t\t\t    amplitude\n" +
    "\t\t\t\t\t\t  * normal\n" +
    "\t\t\t\t\t\t  * vec3( displacement );\n" +
    "\n" +
    "    gl_Position =     projectionMatrix\n" +
    "    \t\t\t\t* modelViewMatrix\n" +
    "    \t\t\t\t* vec4( newPosition, 1.0 );\n" +
    "\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "//"
  );


  $templateCache.put('shaders/sun.fs',
    "//https://github.com/tparisi/WebGLBook/blob/master/Chapter%203/graphics-solar-system.html\n" +
    "//http://stackoverflow.com/questions/8088475/how-to-customise-file-type-to-syntax-associations-in-sublime-2\n" +
    "uniform sampler2D baseTexture;\n" +
    "uniform float baseSpeed;\n" +
    "\n" +
    "uniform sampler2D noiseTexture;\n" +
    "uniform float noiseScale;\n" +
    "uniform float alpha;\n" +
    "uniform float time;\n" +
    "\n" +
    "varying vec2 vUv;\n" +
    "void main()\n" +
    "{\n" +
    "\n" +
    "\n" +
    "    vec4 noiseColor = texture2D( noiseTexture , vUv );\n" +
    "    vec4 baseColor = texture2D( baseTexture , vUv );\n" +
    "\n" +
    "    vec2 noiseCoord = vUv + vec2( 2, 4 ) * 0.1 * time  * baseSpeed;\n" +
    "    noiseCoord.x += noiseColor.g * 0.2;\n" +
    "    noiseCoord.y -= noiseColor.r * 0.3;\n" +
    "\n" +
    "    vec2 noiseCoord2 = vUv + vec2( 1, 0 ) * 0.1 * time  * baseSpeed;\n" +
    "    noiseCoord2.x -= noiseColor.r * 4.0;\n" +
    "    noiseCoord2.y += noiseColor.g * 1.5;\n" +
    "\n" +
    "\n" +
    "    vec2 uvNoiseTimeShift = \t\tvUv\n" +
    "\t\t\t\t\t\t\t\t+\n" +
    "\n" +
    "\t\t\t\t\t\t\t\t\tnoiseScale\n" +
    "                                *   noiseCoord2\n" +
    "                                ;\n" +
    "\n" +
    "    float fog = texture2D( noiseTexture, noiseCoord2 * 3.0 ).a * 0.5 ;\n" +
    "\n" +
    "\tvec4 tempColor = texture2D(\n" +
    "\t\t\t\t\t\t\t\tbaseTexture,\n" +
    "\t\t\t\t\t\t\t\tuvNoiseTimeShift\n" +
    "\t\t\t\t\t\t\t);\n" +
    "    tempColor.a = alpha;\n" +
    "\n" +
    "\n" +
    "\n" +
    "    tempColor += tempColor * 0.45;\n" +
    "\n" +
    "    tempColor -= vec4 (fog) / 0.6;\n" +
    "\n" +
    "\tgl_FragColor = tempColor;\n" +
    "}"
  );


  $templateCache.put('shaders/sun.vs',
    "//http://localhost:3000/Three.js/index.html#textures\n" +
    "varying vec2 vUv;\n" +
    "void main()\n" +
    "{\n" +
    "\t//varying uv mapping\n" +
    "    vUv = uv;\n" +
    "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
    "}"
  );
}]);