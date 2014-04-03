'use strict';
/* global THREE,TWEEN,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, $templateCache, Shaders, WebGLRenderer, doobStat) {

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
		renderer = WebGLRenderer;

		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.position.z = 20;

		state.system.started = true;
	}

	function configDom($element){
		target = $element.find('.gl-detector-container');
		target.html(renderer.domElement);
		renderer.setClearColor( 0x0000ff , 0);
	}



	function genTweenMaterial(currentMaterial){
		var materialTween = new TWEEN.Tween(currentMaterial);
		var materialTween2 = new TWEEN.Tween(currentMaterial);
		materialTween.to({
			wireframeLinewidth:10,
		},1000).chain(materialTween2).start();
		materialTween2.to({
			wireframeLinewidth:1
		},1000).chain(materialTween);
	}

	function genTweenPos(meshPosition){
		var materialTween = new TWEEN.Tween(meshPosition);
		var materialTween2 = new TWEEN.Tween(meshPosition);
		materialTween.to({
			x:5,
		},600).chain(materialTween2).start();
		materialTween2.to({
			x:-5
		},600).chain(materialTween);
	}



	var lastMesh;
	function addObjects(){
		var object3D = new THREE.Object3D();

		function setCurrent(object3D, mesh, material){
			object3D.remove(lastMesh);
			object3D.add(mesh);
			lastMesh = mesh;
			if (lastMesh.material !== material){
				lastMesh.material = material;
			}
		}

		var phongMaterial = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0xff00ff),
			wireframe: true,
			side: THREE.DoubleSide,
			wireframeLinewidth: 1
		});
		var basicMaterial = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0x00ff00),
			wireframe: true,
			wireframeLinewidth: 1,
			side: THREE.DoubleSide
		});

		var octahedronMesh = new THREE.Mesh(
								new THREE.OctahedronGeometry(10,3)
							);
		var torusKnotMesh = new THREE.Mesh(
								new THREE.TorusKnotGeometry( 6, 2, 100, 16 )
							);

		var sphereMesh = new THREE.Mesh(
								new THREE.SphereGeometry(10, 32, 32 )
							);


		setCurrent(object3D, torusKnotMesh, phongMaterial);

		setTimeout(function restartSwitch(){
			setCurrent(object3D, sphereMesh, basicMaterial);

			setTimeout(function(){
				setCurrent(object3D, octahedronMesh, phongMaterial);

				setTimeout(function(){
					setCurrent(object3D, torusKnotMesh, basicMaterial);

					setTimeout(restartSwitch,2000);
				},2000);

			},2000);

		},2000);


		genTweenMaterial(lastMesh.material);
		genTweenPos(object3D.position);

		var getLastMesh = function(){
			return lastMesh;
		};

		var cubeUpdater = function (){
			var lastMesh = getLastMesh();
			if (lastMesh.material.color){
				lastMesh.material.color.offsetHSL(0.001,0.0,0);
			}
			object3D.rotation.z += 0.005;
			object3D.rotation.x += 0.005;
			object3D.rotation.y += 0.005;
		};

		scene.add(object3D);
		updateStack.push(cubeUpdater);
	}

	function addLight(){
		// var ambineLight = new THREE.AmbientLight( 0xffffff ); // soft white light
		// scene.add( ambineLight );

		var lightCenter = new THREE.PointLight( 0xffffff, 1.5, 100 );
		lightCenter.position.set( 0, 0, 20 );
		scene.add( lightCenter );
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

	function tryStartHeart(){
		if (state.system.started){
			startHeart();
		}
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
		addObjects();
	}

	if(Modernizr.mobile){
		$rootScope.isMobile = true;
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
					tryStartHeart();
				}else{
					showNotice($element, $transclude);
				}
			});

		}
	};
});
