'use strict';
/* global THREE,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function (X3) {

	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	var app = new X3();
	window.apwgl = app;

	app.init();

	function configCamera(){
		app.camera.position.z = 20;
	}
	configCamera();

	function addObject(){
		//onetime use only.
		var material = new THREE.MeshLambertMaterial({
			color: 0xff0000,
			wireframe: true,
			wireframeLinewidth: 2,
			side: THREE.BackSide,
			transparent: true,
			opacity: 0.9,
		});

		var inner = new THREE.Mesh(
			new THREE.IcosahedronGeometry(
				10,
				2
			),
			material
		);

		app.scene.add(inner);
		app.updateStack.push(function(){
			inner.rotation.z += 0.004;
			inner.rotation.x += 0.004;
			inner.rotation.y += 0.004;
			inner.material.color.offsetHSL(0.001,0.0,0);
		});
	}
	addObject();

	function addLight(){
		var lightBack = new THREE.DirectionalLight( 0xffffff, 5, 1000 );
		lightBack.position.set( 0, 0, 400 );
		app.scene.add( lightBack );

		app.updateStack.push(function(){
			lightBack.rotation.z += 0.004;
			lightBack.rotation.x += 0.004;
			lightBack.rotation.y += 0.004;
			lightBack.color.offsetHSL(0.001,0.0,0);
		});
	}
	addLight();


	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		//link function is not di.
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
