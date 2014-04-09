'use strict';
/* global THREE,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, X3, frbT) {

	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	var app = new X3();
	window.apwgl = app;

	frbT.addTask({
		ctx: app,
		fn: app.init,
	});
	frbT.addTask({
		ctx: app,
		fn: function configCamera(){
			this.camera.position.z = 20;
		}
	});
	frbT.addTask({
		ctx: app,
		fn: function addObject(){
			//onetime use only.
			var inner = new THREE.Mesh(
				new THREE.IcosahedronGeometry(
					10,
					2
				),
				new THREE.MeshLambertMaterial({
					color: 0xff0000,
					wireframe: true,
					wireframeLinewidth: 2,
					side: THREE.BackSide,
					transparent: true,
					opacity: 0.9,
				})
			);
			this.scene.add(inner);
			this.updateStack.push(function(){
				inner.rotation.z += 0.004;
				inner.rotation.x += 0.004;
				inner.rotation.y += 0.004;
				inner.material.color.offsetHSL(0.001,0.0,0);
			});
		},
	});
	frbT.addTask({
		ctx: app,
		fn: function addLight(){
			var lightBack = new THREE.DirectionalLight( 0xffffff, 5, 1000 );
			lightBack.position.set( 0, 0, 400 );
			this.scene.add( lightBack );

			this.updateStack.push(function(){
				lightBack.rotation.z += 0.004;
				lightBack.rotation.x += 0.004;
				lightBack.rotation.y += 0.004;
				lightBack.color.offsetHSL(0.001,0.0,0);
			});
		},
	});
	frbT.digest();


	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		//link function is not di.
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
