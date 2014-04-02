'use strict';

angular.module('artpopApp')
.directive('webglDetector', function ($rootScope,THREE,Modernizr) {

	var target,
		scene,
		camera,
		renderer,
		frameID,
		updateStack,
		state = {
			render: {
				throttle: false
			},
			resize: {
				invalidate: false,
			}
		};

	function updateScreenSize(){
		state.resize.invalidate = true;
	}

	function initSystem(){
		updateStack = updateStack || [];
		scene = scene || new THREE.Scene();
		camera = camera || new THREE.PerspectiveCamera( 75,  window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = renderer || new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
	}

	function configDom($element){
		target = $element.find('.gl-detector-container');
		target.html(renderer.domElement);
		renderer.setClearColor( 0x0000ff * Math.random(), 0);
	}

	function addCube(){
		var geometry = new THREE.OctahedronGeometry(2,2);
		var material = new THREE.MeshBasicMaterial({
			color: 0xff00ff,
			wireframe: true,
		});
		var cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		var cubeUpdater = function cubeUpdater(){
			cube.rotation.z += 0.005;
			cube.rotation.x += 0.005;
			cube.rotation.y += 0.005;
		};

		updateStack.push(cubeUpdater);
	}

	function addLight(){
		// var ambineLight = new THREE.AmbientLight( 0xffffff ); // soft white light
		// scene.add( ambineLight );
		// var light = new THREE.PointLight( 0xff0000, 1, 100 );
		// light.position.set( 50, 50, -50 );
		// scene.add( light );
	}


	function render(){
		renderer.render(scene, camera);
		animate();
	}


	function animate(){
		for (var i = updateStack.length - 1; i >= 0; i--) {
			var updateFn = updateStack[i];
			if (typeof updateFn === 'function'){
				updateFn();
			}
		}
	}

	function processResize(){
		if (state.resize.invalidate && !state.resize.throttle){
			state.render.throttle = true;
			setTimeout(function(){
				renderer.setSize( window.innerWidth, window.innerHeight );
				camera.aspect	= window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				state.resize.invalidate = false;
				state.render.throttle = false;
			},1000);
		}
	}
	function beatHeart(){
		frameID = window.requestAnimationFrame(beatHeart);
		processResize();

		if (!state.render.throttle){
			render();
		}
	}
	function stopHeart(){
		window.cancelAnimationFrame(frameID);
	}

	function setUpEvents($scope){
		window.addEventListener('resize', updateScreenSize, false);
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
		addCube();
	}

	return {
		template: '<div class="gl-detector-container"></div>',
		restrict: 'E',
		transclude: true,
		precomplile: function(element){
			console.log(element.html());
		},
		controller: function postLink($scope, $element, $attrs, $transclude) {
			if (Modernizr.webgl){
				configDom($element,$attrs);
				setUpEvents($scope);
				beatHeart();
			}else{
				showNotice($element, $transclude);
			}

		}
	};
});
