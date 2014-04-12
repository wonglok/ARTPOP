'use strict';
/* global THREE */
angular.module('artpopApp')
.factory('sharedRenderer', function () {
	// Service logic
	// ...

	var sharedRenderer = new THREE.WebGLRenderer({
	  preserveDrawingBuffer : true
	});

	// Public API here
	return sharedRenderer;
});
