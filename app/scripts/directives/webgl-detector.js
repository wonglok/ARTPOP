'use strict';
/* global THREE,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, X3) {

	// function ARTPOP(){
	// 	X3.apply(this,arguments);
	// }
	// ARTPOP.prototype = Object.create(X3.prototype);

	//hamster code organiser.
	var wgld = new X3();
	wgld.init();
	function addObject3D(){
		var object3D = new THREE.Object3D();
		wgld.updateStack.push(function(){
			object3D.rotation.z += 0.004;
			object3D.rotation.x += 0.004;
			object3D.rotation.y += 0.004;
		});
		wgld.scene.add(object3D);
		var inner = new THREE.Mesh(
			new THREE.IcosahedronGeometry(38,2),
				new THREE.MeshPhongMaterial({
				color: new THREE.Color(0xff0000),
				wireframe: true,
				wireframeLinewidth: 2,
				side: THREE.BackSide,
				transparent: true,
				opacity: 0.9,
			})
		);
		wgld.updateStack.push(function(){
			inner.material.color.offsetHSL(0.001,0.0,0);
		});
		object3D.add(inner);
	}
	function configCamera(){
		wgld.camera.position.z = 20;
	}
	function addLight(){
		var lightBack = new THREE.DirectionalLight( 0xffffff, 5, 1000 );
		lightBack.position.set( 0, 0, 400 );
		wgld.scene.add( lightBack );
	}
	configCamera();
	addObject3D();
	addLight();


	return {
		template: '<div class="gl-canvas-container"></div>',
		restrict: 'E',
		transclude: true,
		controller: function ($scope, $element, $transclude) {
			if (Modernizr.webgl){
				wgld.reconfig($scope, $element);
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
		}
	};

});
