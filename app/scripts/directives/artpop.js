'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.directive('artpop', function (X3, ShaderSpiky) {

	//inherit from X3
	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	//hamster code organiser.

	var apwgl = new X3();

	apwgl.frbT.addTask({
		fn: apwgl.init,
		ctx: apwgl,
	});

	apwgl.frbT.addTask({
		fn: function addObjects(){
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
				clock: apwgl.clock,
				url: 'textures/disturb.jpg'
			});
			apwgl.scene.add( mesh );

			apwgl.updateStack.push(spiky.update.bind(spiky));
		}
	});
	apwgl.frbT.digest();



	function reconfig($scope,$element,$transclude){
		if (Modernizr.webgl){
			apwgl.reconfig($scope, $element);
		}else{
			$element.find('.gl-canvas-container').html($transclude());
		}
	}

	return {
		template: '<div class="gl-canvas-container"></div>',
		restrict: 'E',
		transclude: true,
		// controller: function ($scope, $element, $transclude) {
		// },
		link: function ($scope, $element, $transclude) {
			reconfig($scope, $element, $transclude);
		}
	};
});
