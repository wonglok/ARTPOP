'use strict';
/* global THREE, TWEEN, Modernizr */
angular.module('artpopApp')
	.factory('X3', function (frameBudget, stats, datGUI, frbE, frbT, MFAnimatedGIF) {
		// Service logic
		// HamsterFace 3D Code Organiser
		// Not an engine, just a pretty code organiser for this project.
		// Looking good and feeling fine.



		function X3(){
			var that = this;

			//isntance props
			this.scene = null;
			this.camera = null;
			this.renderer = null;

			//one kind of task stack.
			this.updateStack = [];
			this.state = {
				frameID: 0,
				system: {
					configured: false,
				},
				render: {
					throttle: false,

					skipFrame: true,
					skipFrameTarget: 30,
					skipFrameCurrent: 0,
				},
				resize: {
					timerID: null,
					invalid: false
				},
				loop: {
					valid: true
				},
			};

			this.prebind = {
				loop: that.loop.bind(that)
			};
		}
		X3.prototype.frbT = frbT;
		X3.prototype.frbE = frbE;
		//shortcut to the task service

		//arithmetic
		//1+1
		//0.324832942394324 / 0.324923749823489737722

		//black box.
		//many many white box.

		/*
			{
				stats: stats,
				//optional
				renderer: renderer,
				clearColor: 0xffffff
				canvasContainer: '.gl-canvas-container'
			}
		*/
		X3.prototype.constructor = X3;
		X3.prototype.init = function(param){
			param = param || {};

			//camera
			this.clock = param.clock || new THREE.Clock();
			this.scene = param.scene || new THREE.Scene();
			this.camera = param.camera || new THREE.PerspectiveCamera( 75,  window.innerWidth/window.innerHeight, 0.1, 1000 );

			this.screenshot = param.screenshot || true;

			this.renderer = param.renderer || new THREE.WebGLRenderer({
				preserveDrawingBuffer : this.screenshot
			});
			this.renderer.domElement.classList.add('gl-canvas-container');

			this.renderer.setClearColor( param.clearColor || 0xffffff ,  param.clearAlpha  || 0.5);

			this.state.system.configured = true;

			if (param.manualCamera || false){
			}else{
				//camera
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.setClearColor( 0xffffff , 1);

				//configure camera
				this.camera.aspect	= window.innerWidth / window.innerHeight;
				this.camera.position.z = 105;

				// this.animationEndEventName = X3.animationEndEventNames[Modernizr.prefixed('animation')];
				// this.transitionEndEventName = X3.transitionEndEventNames[Modernizr.prefixed('transition')];
			}

		};



		//static props*
		// X3.animationEndEventNames = {
		// 	'WebkitAnimation' : 'webkitAnimationEnd',
		// 	'OAnimation' : 'oAnimationEnd',
		// 	'msAnimation' : 'MSAnimationEnd',
		// 	'animation' : 'animationend'
		// };
		// X3.transitionEndEventNames = {
		// 	'WebkitTransition' : 'webkitTransitionEnd',
		// 	'OTransition' : 'oTransitionEnd',
		// 	'msTransition' : 'MSTransitionEnd',
		// 	'transition' : 'transitionend'
		// };

		/* ===========================================
			Reconfig in Directives link/controler fnc.
		   ===========================================  */
		X3.prototype.reconfig = function($scope, $element){
			//cache dom and context.
			var that = this;
			var cleanUpStack = [];
			var setUpTask = [];

			var rendererDom = this.renderer.domElement;
			this.$element = $element;

			//---------------------
			//render dom
			//---------------------
			setUpTask.push(function(){
				$element[0].appendChild(rendererDom);
			});
			cleanUpStack.push(function(){
				setTimeout(function(){
					$element.empty();
				},500);
			});

			//---------------------
			//render loop
			//---------------------
			setUpTask.push(function(){
				this.startLoop();
			});
			cleanUpStack.push(function(){
				that.stopLoop();
			});

			//---------------------
			//resizer
			//---------------------
			setUpTask.push(function(){
				window.addEventListener('resize', function(){
					that.handleResizeEvent();
				}, false);
			});
			cleanUpStack.push(function(){
				window.removeEventListener('resize');
			});

			//---------------------
			//webgl context lost
			//---------------------
			setUpTask.push(function(){
				rendererDom.addEventListener('webglcontextlost', function (event) {
					//restartOnContextLost
					event.preventDefault();
					that.stopLoop();
					that.startLoop();
				}, false);
			});
			cleanUpStack.push(function(){
				rendererDom.removeEventListener('webglcontextlost');
			});

			//---------------------
			//slider
			//---------------------
			setUpTask.push(function(){
				datGUI.show();
			});
			cleanUpStack.push(function(){
				datGUI.hide();
			});

			//---------------------
			//stats
			//---------------------
			if (!Modernizr.touch){
				setUpTask.push(function(){
					stats.show();
				});

				cleanUpStack.push(function(){
					stats.hide();
				});
			}

			that.shceduleTaskStackOrder(setUpTask);

			//setup cleanup
			if (typeof $scope.$on === 'function'){
			}else{
				throw new Error('You need to make sure it has cleanup adapter.');
			}

			$scope.$on('$destroy', function() {
				that.shceduleTaskStackReverse(cleanUpStack);
			});
		};

		/* ===========================================
			GifSection
		   ===========================================  */
		//kudos
		//http://stackoverflow.com/questions/8191083/can-one-easily-create-an-html-image-element-from-a-webgl-texture-object
		X3.prototype.takeScreenShot = function(){
			return this.renderer.domElement.toDataURL('image/png',1);
		};

		X3.prototype.reszieForGif = function(){
			this.renderer.setSize( 320, 320 );
			this.camera.aspect = 320 / 320;
			this.camera.updateProjectionMatrix();
		};

		X3.prototype.reszieForWindow = function(){
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		};

		//dirty.
		var count = 0;
		var frame = [];
		var rotations = [];
		X3.prototype.autoMakeGif = function(){
			var that = this;
			var startTime = (new Date()).getTime();
			setTimeout(function loop(){
				var currentTime = (new Date()).getTime();
				console.log('capturing frame', count);
				if (count === 0){
					that.reszieForGif();
					that.stopLoop();

					count++;
					setTimeout(loop,1000/30);
				} else if (currentTime < startTime+1000*4){
					setTimeout(loop,1000/30);
					that.render();


					var img = new Image();
					img.src = that.takeScreenShot();

					frame.push(img);
					rotations.push(0);

					count++;
				}else{
					console.log('start making gif :)');
					that.makeGIF();

				}
			});
		};


		//console.log(frbT.frameBudget / frbE.config.tightenFactor);
		X3.prototype.makeGIF = function(){
			var that = this;
			new MFAnimatedGIF({
				images: frame,
				rotations: rotations,
				delay : 1000/30,
				quality : 3,
				repeat: 0,
				height: 320,
				width : 320,
				progress: function(info){
					var progressDom;
					if (!this.setup){
						that.renderer.domElement.classList.remove('gl-loading');
						that.reszieForWindow();
						that.render();

						progressDom = document.createElement('span');
						progressDom.style.height = '50px';
						progressDom.style.color = 'blue';
						document.getElementById('apwgl-slider').appendChild(progressDom);
						this.setup = true;
					}else{
						progressDom = document.getElementById('apwgl-slider').querySelector('span');
					}

					progressDom.innerHTML = (info* 100).toFixed(0);
					console.log('progress', info * 100);

				},// console.dir(arguments);
				done: function(info){
					console.log('done');
					console.dir(arguments);
					window.gifResult = arguments;

					frame = [];

					// window.open(
					// 	info.binaryURL
					// );

					// if( ( !Modernizr.bloburls || !Modernizr.blobbuilder || !Modernizr.download ) && $('#saveasbro').length === 0) {
					// 	var iframe = document.createElement('iframe');
					// 	iframe.src = 'http://saveasbro.com/gif/';
					// 	iframe.setAttribute('style', 'position: absolute; visibility: hidden; left: -999em;');
					// 	iframe.id = 'saveasbro';
					// 	document.body.appendChild(iframe);
					// }

					// window.onmessage = function(e) {
					// 	e = e || window.event;
					// 	var origin = e.origin || e.domain || e.uri;
					// 	if(origin !== 'http://saveasbro.com'){
					// 		return;
					// 	}
					// 	window.open(e.data);
					// 	// downloadLink.attr('href', );
					// 	// downloadLink.show();
					// };

					// iframe = document.querySelector('#saveasbro');
					// iframe.contentWindow.postMessage(
					// 	JSON.stringify({
					// 		name:'APWGL',
					// 		data: info.rawDataURL,
					// 		formdata: Modernizr.formdata
					// 	}),
					// 	'http://saveasbro.com/gif/'
					// );

					var image;
					image = new Image();
					image.src = info.dataURL;
					document.getElementById('apwgl-slider').appendChild(image);

					setTimeout(function(){
						that.startLoop();
					},1000);

				}
			});
		};


		/* ===========================================
			RenderLoop
		   ===========================================  */


		X3.prototype.enableSkipFrame = function(){
			this.state.render.skipFrame = true;
		};
		X3.prototype.disableSkipFrame = function(){
			this.state.render.skipFrame = false;
		};
		X3.prototype.requestSkipFrame = function(){
			if (this.state.render.skipFrameCurrent === 0 ){
				this.renderer.domElement.classList.add('gl-loading');
				this.state.render.skipFrameCurrent++;
			} else if (this.state.render.skipFrameCurrent < 10){
				this.state.render.skipFrameCurrent++;
			} else if (this.state.render.skipFrameCurrent < this.state.render.skipFrameTarget){
				this.state.render.skipFrameCurrent++;
				return true;
			} else if (this.state.render.skipFrameCurrent === this.state.render.skipFrameTarget){
				this.renderer.domElement.classList.remove('gl-loading');
				this.state.render.skipFrame = !this.state.render.skipFrame;
			}
			return false;
		};

		X3.prototype.requestRender = function(){//
			if (this.state.loop.valid && !this.state.render.throttle){
				// if (this.state.render.skipFrame && this.requestSkipFrame()){
				// 	return;
				// }
				this.render();
			}
		};
		X3.prototype.render = function(){
			this.renderer.render(this.scene, this.camera);
			this.processTaskStackOrder(this.updateStack);
			TWEEN.update();
		};
		X3.prototype.requestMoreFrame = function(){
			if (this.state.loop.valid){
				this.state.frameID = window.requestAnimationFrame(this.prebind.loop);
			}
		};
		X3.prototype.loop = function() {
			this.requestMoreFrame();
			var frameStartTime = window.performance.now();
			stats.begin();
			frbE.requestTakeSample(frameStartTime);
			this.requestResizeWindow();
			this.requestRender(frameStartTime);
			frbT.stepTask(frameStartTime);

			stats.end();
		};

		X3.prototype.startLoop = function() {
			this.renderer.domElement.classList.remove('gl-loading');
			this.state.loop.valid = true;
			this.requestMoreFrame();
		};
		X3.prototype.stopLoop = function() {
			this.renderer.domElement.classList.add('gl-loading');
			this.state.loop.valid = false;
			window.cancelAnimationFrame(this.state.frameID);
		};

		/* ===========================================
			Window Resize
		   ===========================================  */
		X3.prototype.handleResizeEvent = function() {
			this.state.resize.invalid = true;
		};

		X3.prototype.heavyResizeWork = function() {
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.domElement.classList.remove('gl-loading');

			this.state.resize.timerID = null;
			this.state.render.throttle = false;
			this.state.resize.invalid = false;
		};

		X3.prototype.requestResizeWindow = function() {
			if (this.state.resize.invalid){
				var that = this;

				if (!this.state.render.throttle){
					this.state.render.throttle = true;
					this.renderer.domElement.classList.add('gl-loading');
				}

				// if (this.state.resize.timerID !== null){
				// 	clearTimeout(this.state.resize.timerID);
				// }
				this.state.resize.timerID = setTimeout(function(){
					that.heavyResizeWork();
				},450);
			}
		};

		/* ===========================================
			Process Task Stack Sync
		   ===========================================  */
		X3.prototype.processTaskStackReverse = function(stack) {
			for (var i = stack.length - 1, fnc; i >= 0; i--) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					fnc();
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
		};
		X3.prototype.processTaskStackOrder = function(stack) {
			var i, l = stack.length, fnc;
			for (i = 0; i < l; i++) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					fnc();
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
		};

		/* ===========================================
			Scheudle Tasks in Task Stack
		   ===========================================  */
		X3.prototype.shceduleTaskStackOrder = function(stack){
			for (var i = stack.length - 1, fnc; i >= 0; i--) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					frbT.addTask({
						fn: fnc,
						ctx: this,
						args: []
					});
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			frbT.digest();
		};
		X3.prototype.shceduleTaskStackReverse = function(stack){
			for (var i = stack.length - 1, fnc; i >= 0; i--) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					frbT.addTask({
						fn: fnc,
						ctx: this,
						args: []
					});
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			frbT.digest();
		};







		return X3;
	});
