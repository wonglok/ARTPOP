'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.directive('artpop', function (X3, ShaderSpiky, shaderBank, frbT) {

	//inherit from X3
	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	var a = {c:3};
	a.a = null;

	var app = new X3();
	window.apwgl = app;

	frbT.addTask({
		fn: app.init,
		ctx: app,
		data:{
			screenshot: true
		},
	});

	frbT.addTask({
		fn: function addMesh(ShaderSpiky){

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

			//shaderBank.switchTo('spiky');

			var spiky = new ShaderSpiky();
			spiky.init({
				mesh: mesh,
				clock: this.clock,
				url: 'textures/disturb.jpg'
			});
			this.scene.add( mesh );
			this.updateStack.push(spiky.update.bind(spiky));

		},
		ctx: app,
		args:[ShaderSpiky]
	});




	frbT.digest();



	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		link: function () {
			frbT.addTask({
				ctx: app,
				args: arguments,
				fn: function($scope, $element, $transclude){
					if (Modernizr.webgl){
						this.reconfig($scope, $element);
					}else{
						$element.find('.gl-canvas-container').html($transclude());
					}
				},
			});
			frbT.digest();

		}
	};
});
