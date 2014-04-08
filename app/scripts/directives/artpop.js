'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.directive('artpop', function (stats, X3, ShaderSpiky) {

	//inherit from X3
	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	//hamster code organiser.
	var ap = new X3();
	ap.init({
		stats: stats
	});

	function addObjects(){

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
		var spiky = new ShaderSpiky();
		spiky.init({
			mesh: mesh,
			clock: ap.clock,
			url: 'textures/disturb.jpg'
		});
		ap.scene.add( mesh );

		var updateFunc = spiky.update.bind(spiky);
		ap.updateStack.push(updateFunc);
	}
	addObjects();

	return {
		template: '<div class="gl-canvas-container"></div>',
		restrict: 'E',
		transclude: true,
		controller: function ($scope, $element, $transclude) {
			if (Modernizr.webgl){
				ap.reconfig($scope, $element);
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
		}
	};
});
