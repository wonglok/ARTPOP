'use strict';
/* global THREE,TWEEN,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, doobStat) {

	var target,
		scene,
		camera,
		renderer,
		frameID,
		updateStack,
		state = {
			system: {
				started: false,
			},
			render: {
				throttle: false
			},
			resize: {
				invalidate: false,
			}
		};

	function initSystem(){
		updateStack = [];
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75,  window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer();

		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		//camera.position.z = 20;

		state.system.started = true;
	}

	function configDom($element){
		target = $element.find('.gl-detector-container');
		target.html(renderer.domElement);
		renderer.setClearColor( 0x0000ff * 0.5 , 1);
	}

	function addObject3D(){
		var object3D = new THREE.Object3D();

		var wireFrameMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0xff00ff),
			wireframe: true,
			wireframeLinewidth: 3,
			side: THREE.DoubleSide
		});

		var octahedronMesh = new THREE.Mesh(
			new THREE.OctahedronGeometry(10,2)
		);
		octahedronMesh.material = wireFrameMaterial;
		object3D.add(octahedronMesh);
		scene.add(object3D);
		updateStack.push(function cubeUpdater(){
			var color = octahedronMesh.material.color;
			if (color){
				color.offsetHSL(0.0001,0.0,0);
			}
			octahedronMesh.rotation.z += 0.035;
			octahedronMesh.rotation.x += 0.035;
			octahedronMesh.rotation.y += 0.035;
		});
	}

	function addLight(){
		var lightFace = new THREE.PointLight( 0xffffff, 1, 100 );
		lightFace.position.set( 0, 0, 20 );
		scene.add( lightFace );
	}


	function render(){
		renderer.render(scene, camera);
		processUpdateStack();
		TWEEN.update();
	}


	function processUpdateStack(){
		for (var i = updateStack.length - 1; i >= 0; i--) {
			var updateFn = updateStack[i];
			if (typeof updateFn === 'function'){
				updateFn();
			}
		}
	}

	function handleScreenResize(){
		state.resize.invalidate = true;
	}
	function resizeProc(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		setTimeout(function(){
			state.resize.invalidate = false;
			state.render.throttle = false;
		},100);
	}
	function processResize(){
		if (state.resize.invalidate && !state.resize.throttle){
			state.render.throttle = true;

			setTimeout(resizeProc,500);
		}
	}
	function startHeart(){
		doobStat.begin();
		frameID = window.requestAnimationFrame(startHeart);
		processResize();
		if (!state.render.throttle){
			render();
		}
		doobStat.end();
	}

	function stopHeart(){
		window.cancelAnimationFrame(frameID);
	}

	function setUpEvents($scope){
		window.addEventListener('resize', handleScreenResize, false);
		$scope.$on('$destroy', function() {
			stopHeart();
			window.removeEventListener('resize');
		});
	}

	function showNotice($element,$transclude){
		$element.html($transclude());
	}

	if(Modernizr.webgl){
		initSystem();
		addLight();
		addObject3D();
	}

	return {
		template: '<div class="gl-detector-container"></div>',
		restrict: 'E',
		transclude: true,
		controller: function ($scope, $element, $transclude) {
			setTimeout(function(){
				if (Modernizr.webgl){
					configDom($element);
					setUpEvents($scope);
					startHeart();
				}else{
					showNotice($element, $transclude);
				}
			});

		}
	};
});
