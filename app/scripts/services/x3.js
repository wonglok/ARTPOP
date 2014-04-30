'use strict';
/* global THREE, TWEEN, Modernizr */
angular.module('artpopApp')
	.factory('X3', function (frameBudget, stats, datGUI, frbE, frbT, sharedRenderer) {
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

			this.directiveDomElement = null;

			this.domClassName = 'wgl-canvas';

			this.prebind = {
				loop: self.loop.bind(self),
				setScreenInvalid: self.setScreenInvalid.bind(self),
				glContextLost: self.glContextLost.bind(self),
				glContextRestore: self.glContextRestore.bind(self)
			};

		}
		X3.prototype.frbT = frbT;
		X3.prototype.frbE = frbE;



		X3.prototype.constructor = X3;
		X3.prototype.init = function(param){
			param = param || {};

			//camera
			this.clock = param.clock || new THREE.Clock();
			this.scene = param.scene || new THREE.Scene();
			this.camera = param.camera || new THREE.PerspectiveCamera( 75,  window.innerWidth/window.innerHeight, 0.1, 1000 );

			//
			this.renderer = sharedRenderer;
			this.renderer.domElement.classList.add(this.domClassName);
			this.renderer.setClearColor( param.clearColor || 0xffffff ,  param.clearAlpha  || 0.5);
			this.state.system.configured = true;

			//


			if (param.manualCamera || false){
			}else{
				//camera
				this.renderer.setSize( window.innerWidth, window.innerHeight );
				this.renderer.setClearColor( 0xffffff , 1);

				//configure camera
				this.camera.aspect	= window.innerWidth / window.innerHeight;
				this.camera.position.z = 90;

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
		X3.prototype.reconfig = function($scope, $element, container){
			//cache dom and context.
			var self = this;

			var setUpStack = [];
			var cleanUpStack = [];

			//---------------------
			// Directive
			//---------------------
			this.directiveDomElement = $element;


			//
			var rendererDom = this.renderer.domElement;



			//---------------------
			//attach dom
			//---------------------
			setUpStack.push(function(){
				container.appendChild(rendererDom);
			});
			cleanUpStack.push(function(){
				setTimeout(function(){
					container.parentNode.removeChild(container);
				},500);
			});


			//---------------------
			//render loop
			//---------------------
			setUpStack.push(function(){
				self.startLoop();
			});
			cleanUpStack.push(function(){
				self.stopLoop();
			});


			//---------------------
			//resizer
			//---------------------

			setUpStack.push(function(){
				window.addEventListener('resize', self.prebind.setScreenInvalid, false);
			});
			cleanUpStack.push(function(){
				window.removeEventListener('resize', self.prebind.setScreenInvalid, false);
			});

			//---------------------
			//webgl context lost
			//---------------------
			setUpStack.push(function(){
				rendererDom.addEventListener('webglcontextlost', self.prebind.glContextLost, false);
			});
			cleanUpStack.push(function(){
				rendererDom.removeEventListener('webglcontextlost', self.prebind.glContextLost, false);
			});

			setUpStack.push(function(){
				rendererDom.addEventListener('webglcontextrestore', self.prebind.glContextRestore, false);
			});
			cleanUpStack.push(function(){
				rendererDom.removeEventListener('webglcontextrestore', self.prebind.glContextRestore, false);
			});

			//---------------------
			//slider
			//---------------------
			setUpStack.push(function(){
				if (typeof self.setUpCtr === 'function'){
					datGUI.show();
				}
			});
			cleanUpStack.push(function(){
				if (typeof self.cleanUpCtr === 'function'){
					datGUI.hide();
				}
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
			WebGL Context Lost Handler
		   ===========================================  */
		X3.prototype.glContextLost = function(e){//
			e.preventDefault();
			this.stopLoop();
		};
		X3.prototype.glContextRestore = function(e){//
			e.preventDefault();
			this.startLoop();
		};


		/* ===========================================
			RenderLoop
		   ===========================================  */
		X3.prototype.requestRender = function(){//
			if (this.state.loop.valid && !this.state.render.throttle){
				this.render();
			}
		};
		X3.prototype.update = function(){

		};
		X3.prototype.render = function(){
			this.renderer.render(this.scene, this.camera);
			this.requestUpdateControl();
			this.update();
			this.processTaskStackOrder(this.updateStack);
			TWEEN.update();
		};
		X3.prototype.requestUpdateControl = function(){
			if (this.controls){
				this.controls.update();
			}
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
		X3.prototype.setScreenInvalid = function() {
			this.state.resize.invalid = true;
		};
		X3.prototype.setScreenValid = function() {
			this.state.resize.invalid = false;
		};
		X3.prototype.hideDom = function(){
			this.renderer.domElement.style.visibility = 'hidden';
		};
		X3.prototype.showDom = function(){
			this.renderer.domElement.style.visibility = 'visible';
		};
		X3.prototype.setDomBusy = function(){
			this.renderer.domElement.classList.add('gl-loading');
		};
		X3.prototype.setDomFree = function(){
			this.renderer.domElement.classList.remove('gl-loading');
		};
		X3.prototype.resizeRenderer = function(width,height) {
			this.renderer.setSize( width, height );
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			// if(this.controls){
			// 	this.controls.handleResize();
			// }
		};
		X3.prototype.throttleRender = function(){
			this.state.render.throttle = true;
			this.setDomBusy();
		};
		X3.prototype.restoreRender = function(){
			this.state.render.throttle = false;
			this.setDomFree();
		};
		X3.prototype.processResizeRequest = function(){
			this.hideDom();
			this.resizeRenderer(window.innerWidth, window.innerHeight);
			this.setScreenValid();
			this.showDom();
			this.restoreRender();
		};
		X3.prototype.requestScheduleResizeWindow = function() {
			if (this.state.resize.invalid && !this.state.render.throttle){
				this.throttleRender();
				var self = this;
				setTimeout(function(){
					self.processResizeRequest();
				},750);
			}
		};



		/* ===========================================
			Process Task Stack Sync
		   ===========================================  */
		X3.prototype.processTaskStackReverse = function(stack) {
			var i, l = stack.length, fnc;
			if (l === 0){ return; }
			for (i = l - 1; i >= 0; i--) {
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
			if (l === 0){ return; }
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
			var i, l = stack.length, fnc;
			if (l === 0){ return; }
			for (i = 0; i < l; i++) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					this.addTask(fnc);
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			this.digest();
		};
		X3.prototype.shceduleTaskStackReverse = function(stack){
			if (stack.length === 0){ return; }
			for (var i = stack.length - 1, fnc; i >= 0; i--) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					this.addTask(fnc);
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			this.digest();
		};

		/* ===========================================
			FrameBudget Task Manager Shortcut
		   ===========================================  */
		X3.prototype.digest = function(){
			this.frbT.digest();
		};
		X3.prototype.addTask = function(task,option){
			var config = {
				ctx: this,
				fn: task
			};
			if (!!option && option instanceof Array){
				config.args = option;
			}
			if (!!option && option instanceof Object){
				config.data = option;
			}
			frbT.addTask(config);
		};


		return X3;
	});
