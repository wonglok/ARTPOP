'use strict';
/* global THREE,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, X3, frbT) {

	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	var app = new X3();
	frbT.addTask({
		fn: app.init,
		ctx: app,
		data: {
		}
	});
	frbT.addTask({
		fn: function(){
			configCamera();
			addObject();
			addLight();
		},
	});
	frbT.digest();

	function configCamera(){
		app.camera.position.z = 20;
	}
	function addObject(){
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
		app.updateStack.push(function(){
			inner.rotation.z += 0.004;
			inner.rotation.x += 0.004;
			inner.rotation.y += 0.004;
			inner.material.color.offsetHSL(0.001,0.0,0);
		});
		app.scene.add(inner);
	}
	function addLight(){
		var lightBack = new THREE.DirectionalLight( 0xffffff, 5, 1000 );
		lightBack.position.set( 0, 0, 400 );

		app.updateStack.push(function(){
			lightBack.rotation.z += 0.004;
			lightBack.rotation.x += 0.004;
			lightBack.rotation.y += 0.004;
			lightBack.color.offsetHSL(0.001,0.0,0);
		});
		app.scene.add( lightBack );
	}

	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		controller: function ($scope, $element, $transclude) {

			frbT.addTask({
				fn: function(){
					if (Modernizr.webgl){
						app.reconfig($scope, $element);
					}else{
						$element.find('.gl-canvas-container').html($transclude());
					}
					window.apwgl = app;
				}
			});
			frbT.digest();
		}
	};

});
