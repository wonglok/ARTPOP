'use strict';
/* global THREE */
angular.module('artpopApp')
  .factory('webGLRenderer', function () {
    return new THREE.WebGLRenderer();
  });
