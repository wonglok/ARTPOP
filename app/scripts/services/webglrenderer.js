'use strict';
/* global THREE */
angular.module('artpopApp')
  .factory('WebGLRenderer', function () {
    return new THREE.WebGLRenderer();
  });
