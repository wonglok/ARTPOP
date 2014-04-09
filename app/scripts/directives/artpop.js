'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.directive('artpop', function (X3, ShaderSpiky, shaderBank) {

	//inherit from X3
	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	var a = {c:3};
	a.a = null;


	var apwgl = new X3();
	apwgl.init({
		screenshot: true
	});

	var meshFactory = {
		eightFace: function (param){
			param = param || {};
			var radius = param.radius || 50,
			detail = param.detail || 0;

			var geometry = new THREE.IcosahedronGeometry(radius,detail);
			geometry.dynamic = true;
			var mesh = new THREE.Mesh( geometry );
			return mesh;
		},
		ball: function (param){
			param = param || {};
			var radius = param.radius || 50,
				segments = param.segments || 64,
				rings = param.rings || 64;

			var geometry = new THREE.SphereGeometry( radius, segments, rings );
			geometry.dynamic = true;
			var mesh = new THREE.Mesh( geometry );
			return mesh;
		}
	};

	var currentItem = 'ball';
	var mesh = meshFactory[currentItem]();

	shaderBank.switchTo('spiky');

	var spiky = new ShaderSpiky();
	spiky.init({
		mesh: mesh,
		clock: apwgl.clock,
		url: 'textures/disturb.jpg'
	});
	apwgl.scene.add( mesh );
	apwgl.updateStack.push(spiky.update.bind(spiky));


	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		link: function ($scope, $element, $transclude) {
			if (Modernizr.webgl){
				apwgl.reconfig($scope, $element);
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
			window.apwgl = apwgl;
		}
	};
});
