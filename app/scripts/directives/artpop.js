'use strict';
/* global THREE,TWEEN,Modernizr */
angular.module('artpopApp')
.directive('artpop', function ($rootScope, shaders, webGLRenderer, doobStat, CORSCanvas) {

	var target,
		scene,
		camera,
		renderer,
		frameID,
		timerID,
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
		renderer = webGLRenderer;

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

	function setMesh(object3D, mesh, material){
		if(object3D.lastMesh){
			object3D.remove(object3D.lastMesh);
		}
		mesh.material = material;
		object3D.add(mesh);
		object3D.lastMesh = mesh;
	}

	function scheduleItem(object3D, effecktStack){
		var effecktStackIndex = 0;
		timerID = setInterval(function(){
			if (effecktStackIndex > effecktStack.length -1){
				effecktStackIndex = 0;
			}
			var curEffect = effecktStack[effecktStackIndex];
			setMesh(object3D,curEffect[0],curEffect[1]);
			effecktStackIndex++;
		},2000);
	}

	function addObjects(){
		var object3D = new THREE.Object3D();

		var phongMaterial = new THREE.MeshPhongMaterial({
			color: new THREE.Color(0x0000ff),
		});
		var wireFrameMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0x0000ff),
			wireframe: true,
			wireframeLinewidth: 3,
			side: THREE.DoubleSide
		});

		var cubeMesh = new THREE.Mesh(
			new THREE.CubeGeometry(10, 10, 10 )
		);
		var icosahedronMesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(10,0)
		);
		var torusKnotMesh = new THREE.Mesh(
			new THREE.TorusKnotGeometry( 6, 2, 100, 16 )
		);
		var cylinderMesh = new THREE.Mesh(
			new THREE.CylinderGeometry( 5, 5, 20, 32 )
		);

		var effecktStack = [
			// [icosahedronMesh, wireFrameMaterial],
			[cylinderMesh, phongMaterial],
			// [cubeMesh, wireFrameMaterial],
			// [torusKnotMesh, phongMaterial]
		];

		setMesh(object3D,effecktStack[0][0],effecktStack[0][1]);

		scheduleItem(object3D, effecktStack);

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

		var texture = null;
		CORSCanvas
		.getTexture('http://www.semicomplete.com/images/googledotcom.png')
		.then(function(result){
			texture = new THREE.Texture(result.obj);
			texture.needsUpdate = true;
			cylinderMesh.material.map = texture;
			console.log(result);
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
		doobStat.begin();
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
					doobStat.end();
				}else{
					showNotice($element, $transclude);
				}
			});

		}
	};
});
