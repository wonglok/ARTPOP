'use strict';
/* global Modernizr,TWEEN, THREE */
angular.module('artpopApp')
.factory('ARTPOP', function (doobStat, ShaderSpiky) {

	var clock,
		scene,
		camera,
		renderer,
		frameID,
		updateStack,
		state = {
			system: {
				configured: false,
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
		clock = new THREE.Clock();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75,  window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff , 0.5);

		state.system.configured = true;
	}


	// function setMeshMaterial(object3D, mesh, material){
	//  if(object3D.lastMesh){
	//    object3D.remove(object3D.lastMesh);
	//  }
	//  mesh.material = material;
	//  object3D.add(mesh);
	//  object3D.lastMesh = mesh;
	// }

	// function scheduleItem(object3D, effecktStack){
	//  var effecktStackIndex = 0;
	//  timerID = setInterval(function(){
	//    if (effecktStackIndex > effecktStack.length -1){
	//      effecktStackIndex = 0;
	//    }
	//    var curEffect = effecktStack[effecktStackIndex];
	//    setMeshMaterial(object3D,curEffect[0],curEffect[1]);
	//    effecktStackIndex++;
	//  },2000);
	// }

	// var object3D = new THREE.Object3D();
	// THREE.ImageUtils.crossOrigin = '*';
	// var phongMaterial = new THREE.MeshPhongMaterial({
	//  map: THREE.ImageUtils.loadTexture('http://www.corsproxy.com/www.semicomplete.com/images/googledotcom.png'),
	//  color: new THREE.Color(0x0000ff),
	// });
	// var wireFrameMaterial = new THREE.MeshBasicMaterial({
	//  color: new THREE.Color(0x0000ff),
	//  wireframe: true,
	//  wireframeLinewidth: 3,
	//  side: THREE.DoubleSide
	// });

	// var cubeMesh = new THREE.Mesh(
	//  new THREE.CubeGeometry(10, 10, 10 )
	// );
	// var icosahedronMesh = new THREE.Mesh(
	//  new THREE.IcosahedronGeometry(10,0)
	// );
	// var torusKnotMesh = new THREE.Mesh(
	//  new THREE.TorusKnotGeometry( 6, 2, 100, 16 )
	// );
	// var cylinderMesh = new THREE.Mesh(
	//  new THREE.CylinderGeometry( 5, 5, 20, 32 )
	// );

	// var effecktStack = [
	//  [icosahedronMesh, wireFrameMaterial],
	//  [cylinderMesh, phongMaterial],
	//  [cubeMesh, wireFrameMaterial],
	//  [torusKnotMesh, phongMaterial]
	// ];

	// setMeshMaterial(object3D,effecktStack[0][0],effecktStack[0][1]);
	// scheduleItem(object3D, effecktStack);

	// var texture = null;
	// CORSCanvas
	//  .getTexture('')
	//  .then(function(result){
	//    texture = new THREE.Texture(result.img);
	//    phongMaterial.map = texture;
	//    texture.needsUpdate = true;
	//  });
	// scene.add(object3D);

	// var lastMesh = object3D.lastMesh;
	// if (color){
	//  var color = lastMesh.material.color;
	//  color.offsetHSL(0.001,0.0,0);
	// }
	// if (lastMesh && lastMesh.material && lastMesh.material.wireframeLinewidth && lastMesh.material.wireframeLinewidth < 0.5){
	//  lastMesh.material.wireframeLinewidth += 1;
	// }

	// mesh.rotation.x += 0.005;
	// mesh.rotation.y += 0.005;



	function addObjects(){

		function meshFactory(param){
			param = param || {};
			var radius = param.radius || 50,
				segments = param.segments || 128,
				rings = param.rings || 64;

			var geometry = new THREE.SphereGeometry( radius, segments, rings );
			geometry.dynamic = true;
			var mesh = new THREE.Mesh( geometry );
			return mesh;
		}

		var mesh = meshFactory();
		var spiky = new ShaderSpiky();
		spiky.init({
			mesh: mesh,
			clock: clock,
			url: 'textures/disturb.jpg'
		});
		scene.add( mesh );

		var updateFunc = spiky.update.bind(spiky);
		updateStack.push(updateFunc);
	}

	function addLight(){
		// var lightBack = new THREE.PointLight( 0xffffff, 1, 100 );
		// lightBack.position.set( 0, 0, -30 );
		// scene.add( lightBack );

		// var lightCenter = new THREE.PointLight( 0xffffff, 1, 100 );
		// lightCenter.position.set( 0, 0, 0 );
		// scene.add( lightCenter );

		// var lightFront = new THREE.PointLight( 0xffffff, 1, 100 );
		// lightFront.position.set( 0, 0, 30 );
		// scene.add( lightFront );
	}

	function processUpdateStack(){
		for (var i = updateStack.length - 1; i >= 0; i--) {
			var updateFn = updateStack[i];
			if (typeof updateFn === 'function'){
				updateFn();
			}
		}
	}
	function render(){
		renderer.render(scene, camera);
		processUpdateStack();
		TWEEN.update();
	}
	function loop(){
		frameID = window.requestAnimationFrame(loop);
		doobStat.begin();
		tryResizeWindow();
		if (!state.render.throttle){
			render();
		}
		doobStat.end();
	}

	function resumeRender(){
		state.resize.invalidate = false;
		state.render.throttle = false;
	}
	function resizeProc(){
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		setTimeout(resumeRender,100);
	}
	function tryResizeWindow(){
		if (state.resize.invalidate && !state.resize.throttle){
			state.render.throttle = true;
			setTimeout(resizeProc,500);
		}
	}



	function startLoop(){
		if (!state.system.configured){
			loop();
		}else{
			window.requestAnimationFrame(loop);
		}
	}
	function stopLoop(){
		window.cancelAnimationFrame(frameID);
	}



	function handleScreenResize(){
		state.resize.invalidate = true;
	}
	function setUpEvents($scope){
		window.addEventListener('resize', handleScreenResize, false);
		$scope.$on('$destroy', function() {
			stopLoop();
			window.removeEventListener('resize');
		});
	}
	function configCamera(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.position.z = 105;
	}
	function configRenderer(){
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function configDom($element){
		var target = $element.find('.gl-canvas-container');
		target.html(renderer.domElement);
	}


	if(Modernizr.webgl){
		initSystem();
		configRenderer();
		configCamera();
		addLight();
		addObjects();
	}

	return {
		configDom: configDom,
		configRenderer: configRenderer,
		setUpEvents: setUpEvents,
		startLoop: startLoop,
		stopLoop: stopLoop,
	};
});








