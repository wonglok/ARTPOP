'use strict';
/* global THREE,TWEEN,Modernizr */
angular.module('artpopApp')
.directive('webglDetector', function ($rootScope, Shaders, WebGLRenderer, doobStat) {

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
		renderer.setClearColor( 0xffffff , 0);
	}

	function addObjects(){
		var lastMesh;
		var object3D = new THREE.Object3D();

		var phongMaterial = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0x0000ff),
		});
		var wireFrameMaterial = new THREE.MeshLambertMaterial({
			color: new THREE.Color(0x0000ff),
			wireframe: true,
			wireframeLinewidth: 3,
			side: THREE.DoubleSide
		});

		var octahedronMesh = new THREE.Mesh(
			new THREE.OctahedronGeometry(10,2)
		);
		var sphereMesh = new THREE.Mesh(
			new THREE.SphereGeometry(10, 16, 16 )
		);
		var torusKnotMesh = new THREE.Mesh(
			new THREE.TorusKnotGeometry( 6, 2, 100, 16 )
		);

		octahedronMesh.material = phongMaterial;

		function setMesh(mesh, material){
			if(object3D.lastMesh){
				object3D.remove(object3D.lastMesh);
			}
			mesh.material = material;
			object3D.add(mesh);
			object3D.lastMesh = mesh;
		}


		var effecktStack = [
			[sphereMesh, wireFrameMaterial],
			[octahedronMesh, wireFrameMaterial],
			[torusKnotMesh, phongMaterial]
		];
		setMesh(effecktStack[0][0],effecktStack[0][1]);


		var effecktStackIndex = 0;
		setInterval(function(){
			if (effecktStackIndex > effecktStack.length -1){
				effecktStackIndex = 0;
			}
			var curEffect = effecktStack[effecktStackIndex];
			setMesh(curEffect[0],curEffect[1]);
			effecktStackIndex++;
		},1500);

		scene.add(object3D);
		updateStack.push(function cubeUpdater(){
			var lastMesh = object3D.lastMesh;
			var color = lastMesh.material.color;
			if (color){
				color.offsetHSL(0.001,0.0,0);
			}
			if (lastMesh.material && lastMesh.material.wireframeLinewidth && lastMesh.material.wireframeLinewidth < 0.5){
				lastMesh.material.wireframeLinewidth += 1;
			}

			object3D.rotation.z += 0.035;
			object3D.rotation.x += 0.035;
			object3D.rotation.y += 0.035;
		});
	}

	function addLight(){
		var lightCenter = new THREE.PointLight( 0xffffff, 1, 100 );
		lightCenter.position.set( 0, 0, 0 );
		scene.add( lightCenter );

		var lightFace = new THREE.PointLight( 0xffffff, 1, 100 );
		lightFace.position.set( 0, 0, 30 );
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
