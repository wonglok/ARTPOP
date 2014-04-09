angular.module('artpopApp').run(['$templateCache', function($templateCache) {  'use strict';

  $templateCache.put('shaders/spiky.fs',
    "/*http://threejs.org/examples/webgl_custom_attributes.html*/\n" +
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
    "\t//threejs\n" +
    "\tlight = normalize( light );\n" +
    "\n" +
    "\tfloat dProd = dot( vNormal, light )\n" +
    "\t\t\t\t\t* 0.5\n" +
    "\t\t\t\t\t+ 0.5;\n" +
    "\n" +
    "\tvec4 tcolor = texture2D( texture, vUv );\n" +
    "\n" +
    "\tvec4 gray = vec4(\n" +
    "\t\t\t\t\tvec3( tcolor.r * 0.5 + tcolor.g * 0.59 + tcolor.b * 0.11 )\n" +
    "\t\t\t\t,\n" +
    "\t\t\t\t\t1.0\n" +
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
    "/**/"
  );


  $templateCache.put('shaders/spiky.vs',
    "/*http://threejs.org/examples/webgl_custom_attributes.html*/\n" +
    "uniform float amplitude;\n" +
    "\n" +
    "attribute float displacement;\n" +
    "\n" +
    "varying vec3 vNormal;\n" +
    "varying vec2 vUv;\n" +
    "\n" +
    "void main() {\n" +
    "\n" +
    "\tvNormal = normal;\n" +
    "\tvUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );\n" +
    "\n" +
    "\tvec3 newPosition = position + amplitude * normal * vec3( displacement );\n" +
    "\tgl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "/**/"
  );
}]);