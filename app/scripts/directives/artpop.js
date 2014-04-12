'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.directive('artpop', function (X3, ShaderSpiky) {

	function ARTPOP(){
		X3.apply(this,arguments);
	}
	ARTPOP.prototype = Object.create(X3.prototype);


	var app = new ARTPOP();

	app.init();

	function addMesh(){
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
				var radius = param.radius || 40,
					segments = param.segments || 75,
					rings = param.rings || 75;

				var geometry = new THREE.SphereGeometry( radius, segments, rings );
				geometry.dynamic = true;
				var mesh = new THREE.Mesh( geometry );
				return mesh;
			}
		};

		var mesh = meshFactory.ball();

		var spiky = new ShaderSpiky();
		spiky.init({
			mesh: mesh,
			clock: app.clock,
			url: 'textures/disturb.jpg'
		});


		app.scene.add( mesh );



		app.updateStack.push(spiky.update.bind(spiky));
	}
	addMesh();



	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		link: function($scope, $element, $transclude){
			if (Modernizr.webgl){
				app.reconfig($scope, $element);
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
		}
	};
});





/**/