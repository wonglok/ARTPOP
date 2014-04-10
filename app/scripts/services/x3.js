'use strict';
/* global THREE, TWEEN, Modernizr */
angular.module('artpopApp')
	.factory('X3', function (frameBudget, stats, datGUI, frbE, frbT, gifMaker) {
		// Service logic
		// HamsterFace 3D Code Organiser
		// Not an engine, just a pretty code organiser for this project.
		// Looking good and feeling fine.



		function X3(){
			var self = this;

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
				},
				resize: {
					invalid: false,
					timeID: null
				},
				loop: {
					valid: true
				},
			};

			this.prebind = {
				loop: self.loop.bind(self)
			};
		}
		X3.prototype.frbT = frbT;
		X3.prototype.frbE = frbE;
		X3.prototype.gifMaker = gifMaker;//service

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
			var self = this;
			var cleanUpStack = [];
			var setUpStack = [];

			//---------------------
			// GIF Maker
			//---------------------
			gifMaker.switchTo(self);


			var rendererDom = this.renderer.domElement;
			this.$element = $element;

			//---------------------
			//render dom
			//---------------------
			setUpStack.push(function(){
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
			setUpStack.push(function(){
				this.startLoop();
			});
			cleanUpStack.push(function(){
				self.stopLoop();
			});

			//---------------------
			//resizer
			//---------------------
			setUpStack.push(function(){
				window.addEventListener('resize', function(){
					self.setScreenInvalid();
				}, false);
			});
			cleanUpStack.push(function(){
				window.removeEventListener('resize');
			});

			//---------------------
			//webgl context lost
			//---------------------
			setUpStack.push(function(){
				rendererDom.addEventListener('webglcontextlost', function (event) {
					//restartOnContextLost
					event.preventDefault();
					self.stopLoop();
					self.startLoop();
				}, false);
			});
			cleanUpStack.push(function(){
				rendererDom.removeEventListener('webglcontextlost');
			});

			//---------------------
			//slider
			//---------------------
			setUpStack.push(function(){
				datGUI.show();
			});
			cleanUpStack.push(function(){
				datGUI.hide();
			});

			//---------------------
			//stats
			//---------------------
			if (!Modernizr.touch){
				setUpStack.push(function(){
					stats.show();
				});

				cleanUpStack.push(function(){
					stats.hide();
				});
			}

			self.shceduleTaskStackOrder(setUpStack);

			//setup cleanup
			if (typeof $scope.$on === 'function'){
			}else{
				throw new Error('You need to make sure it has cleanup adapter.');
			}

			$scope.$on('$destroy', function() {
				self.shceduleTaskStackReverse(cleanUpStack);
			});
		};

		/* ===========================================
			Gif Delegate Section
		   ===========================================  */


		/* ===========================================
			RenderLoop
		   ===========================================  */
		X3.prototype.requestRender = function(){//
			if (this.state.loop.valid && !this.state.render.throttle){
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
			var frameStartTime = window.performance.now();
			stats.begin();

			this.requestMoreFrame();
			frbE.requestTakeSample(frameStartTime);
			this.requestScheduleResizeWindow();
			this.requestRender(frameStartTime);

			//try do all task
			frbT.stepTask(frameStartTime);

			stats.end();
		};

		X3.prototype.startLoop = function() {
			this.state.loop.valid = true;
			this.requestMoreFrame();
		};
		X3.prototype.stopLoop = function() {
			this.state.loop.valid = false;
			window.cancelAnimationFrame(this.state.frameID);
		};

		/* ===========================================
			Window Resize
		   ===========================================  */
		X3.prototype.showBusy = function(){
			this.renderer.domElement.classList.add('gl-loading');
		};
		X3.prototype.hideBusy = function(){
			this.renderer.domElement.classList.remove('gl-loading');
		};
		X3.prototype.setScreenInvalid = function() {
			this.state.resize.invalid = true;
		};
		X3.prototype.setScreenValid = function() {
			this.state.resize.invalid = false;
		};
		X3.prototype.resizeRenderer = function(width,height) {
			this.renderer.setSize( width, height );
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		};
		X3.prototype.throttleRender = function(){
			this.state.render.throttle = true;
			this.showBusy();
		};
		X3.prototype.restoreRender = function(){
			this.state.render.throttle = false;
			this.hideBusy();
		};

		X3.prototype.addTask = function(task){
			frbT.addTask({
				ctx: this,
				fn: task
			});
		};
		X3.prototype.resizeAfterRequest = function(){
			this.addTask(function(){
				this.resizeRenderer(window.innerWidth, window.innerHeight);
				this.restoreRender();
				this.setScreenValid();
			});
		};
		X3.prototype.requestScheduleResizeWindow = function() {
			if (this.state.resize.invalid && !this.state.render.throttle){
				this.throttleRender();
				var self = this;
				setTimeout(function(){
					self.resizeAfterRequest();
				},750);
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
					this.addTask(fnc);

					// frbT.addTask({
					// 	fn: fnc,
					// 	ctx: this,
					// 	args: []
					// });
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
					this.addTask(fnc);

					// frbT.addTask({
					// 	fn: fnc,
					// 	ctx: this,
					// 	args: []
					// });
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			frbT.digest();
		};



		return X3;
	});
