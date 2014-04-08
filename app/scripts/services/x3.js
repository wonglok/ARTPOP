'use strict';
/* global THREE, TWEEN, Modernizr */
angular.module('artpopApp')
	.factory('X3', function (frameBudget, stats, datGUI) {
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
					throttle: false
				},
				resize: {
					timerID: null,
					invalid: false
				},
				loop: {
					valid: true
				}
			};

			this.prebind = {
				loop: that.loop.bind(that)
			};
		}
		//shortcut to the task service
		X3.prototype.frbT = frameBudget.frbT;
		X3.prototype.frbE = frameBudget.frbE;
		X3.prototype.gui =  datGUI;

		//stats
		X3.prototype.stats = stats;

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
			this.renderer = param.renderer || new THREE.WebGLRenderer();
			this.renderer.setClearColor( param.clearColor || 0xffffff ,  param.clearAlpha  || 0.5);
			this.canvasContainer = param.canvasContainer || '.gl-canvas-container';

			//camera
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.setClearColor( 0xffffff , 1);

			//configure camera
			this.camera.aspect	= window.innerWidth / window.innerHeight;
			this.camera.position.z = 105;

			// this.animationEndEventName = X3.animationEndEventNames[Modernizr.prefixed('animation')];
			// this.transitionEndEventName = X3.transitionEndEventNames[Modernizr.prefixed('transition')];

			this.state.system.configured = true;
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

			var glContainer = $element.find(this.canvasContainer);
			var rendererDom = this.renderer.domElement;

			//---------------------
			//render dom
			//---------------------
			glContainer.html(rendererDom);
			cleanUpStack.push(function(){
				setTimeout(function(){
					$element.empty();
				},500);
			});

			//---------------------
			//render loop
			//---------------------
			this.startLoop();
			cleanUpStack.push(function(){
				that.stopLoop();
			});

			//---------------------
			//resizer
			//---------------------
			window.addEventListener('resize', function(){
				that.handleResizeEvent();
			}, false);
			cleanUpStack.push(function(){
				window.removeEventListener('resize');
			});

			//---------------------
			//webgl context lost
			//---------------------
			rendererDom.addEventListener('webglcontextlost', function (event) {
				//restartOnContextLost
				event.preventDefault();
				that.stopLoop();
				that.startLoop();
			}, false);
			cleanUpStack.push(function(){
				rendererDom.removeEventListener('webglcontextlost');
			});

			//webgl
			if (Modernizr.webgl){
				//---------------------
				//slider
				//---------------------
				var slideContainer = angular.element('#apwgl-slider');
				slideContainer.html(this.gui.domElement);
				cleanUpStack.push(function(){
					slideContainer.empty();
				});


				//---------------------
				//stats
				//---------------------
				if (Modernizr.touch){
					var statsContainer = angular.element('#apwgl-stats');
					statsContainer.html(stats.domElement);
					cleanUpStack.push(function(){
						statsContainer.empty();
					});
				}
			}

			//setup cleanup
			if (typeof $scope.$on === 'function'){
			}else{
				throw new Error('You need to make sure it has cleanup adapter.');
			}

			//---------------------
			//
			//---------------------
			$scope.$on('$destroy', function() {
				that.shceduleTaskStackReverse(cleanUpStack);
			});
		};


		/* ===========================================
			RenderLoop
		   ===========================================  */
		X3.prototype.loopBegin = function(frameStartTime){//
			this.frbE.requestTakeSample(frameStartTime);
			this.requestResizeWindow();
			this.stats.begin();
		};
		X3.prototype.loopEnd = function(){
			this.stats.end();
		};
		X3.prototype.render = function(frameStartTime){//
			this.renderer.render(this.scene, this.camera);
			TWEEN.update();
			this.processTaskStackOrder(this.updateStack);

			this.frbT.stepTask(frameStartTime);
		};
		X3.prototype.loop = function() {
			var frameStartTime = window.performance.now();
			this.loopBegin(frameStartTime);
			if (this.state.loop.valid){
				if (!this.state.render.throttle){
					this.render(frameStartTime);
				}
				this.state.frameID = window.requestAnimationFrame(this.prebind.loop);
			}
			this.loopEnd();
		};


		X3.prototype.startLoop = function() {
			this.state.loop.valid = true;
			window.requestAnimationFrame(this.prebind.loop);
		};
		X3.prototype.stopLoop = function() {
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
			this.state.resize.timerID = null;
			this.renderer.domElement.classList.remove('resizing');
			this.state.render.throttle = false;
			this.state.resize.invalid = false;
		};

		X3.prototype.requestResizeWindow = function() {
			if (!this.state.render.throttle && this.state.resize.invalid){
				this.state.render.throttle = true;

				this.renderer.domElement.classList.add('resizing');
				clearTimeout(this.state.resize.timerID);

				var that = this;
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
		X3.prototype.shceduleTaskStackReverse = function(stack){
			for (var i = stack.length - 1, fnc; i >= 0; i--) {
				fnc = stack[i];
				if (typeof fnc === 'function'){
					this.frbT.addTask({
						fn: fnc,
						ctx: this,
						args: []
					});
				}else{
					throw new Error('not a fuction in process stack');
				}
			}
			this.frbT.digest();
		};





		return X3;
	});
