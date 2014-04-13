'use strict';

angular.module('artpopApp')
.factory('gifMaker', function (MFAnimatedGIF, frbT, $http, $templateCache, datGUI) {
	// Service logic
	// ...
	function GifMaker(){
		this.state = {
			busy: false,

			count: 0
		};
		this.config = {
			timeLength: 1000*3,
			frameDelay: 1000/24,
			size: {
				source: {
					width: 256,
					height: 256
				},
				gif: {
					width: 256,
					height: 256
				}
			}
		};
		this.prebind = {
			done: this.done.bind(this),
			error: this.error.bind(this),
			progress: this.progress.bind(this),
		};

		this.app = null;

		this.frameData = [];
		this.rotations = [];


		this.ratio = (function(){

			// //http://www.html5rocks.com/en/tutorials/canvas/hidpi/
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio = context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1,
			ratio = devicePixelRatio / backingStoreRatio;

			return ratio;
		}());

	}
	GifMaker.prototype = {
		constructor: GifMaker,
		//app section
		addTask: function(tsk, arr){
			frbT.addTask({
				ctx: this,
				fn: tsk,
				args: arr
			});
		},
		switchTo: function(app){
			this.app = app;
		},
		fitToScreen: function(){
			var renEl = this.app.renderer.domElement;
			var rWidth = renEl.width;
			var rHeight = renEl.height;
			var rAspect = rWidth/rHeight;

			if (rAspect <= 1){
				renEl.style.width = '100%';
				renEl.style.height = '';
			}else{
				renEl.style.width = '';
				renEl.style.height = '100%';
			}
		},
		restoreFit: function(){
			var renEl = this.app.renderer.domElement;
			renEl.style.width = '';
			renEl.style.height = '';
		},

		updateRendererForGif: function(){
			var source = this.config.size.source;
			var width = source.width;
			var height = source.height;

			this.fitToScreen();
			this.app.resizeRenderer(width, height);
		},
		updateRendererForApp : function(){
			this.restoreFit();
			this.app.resizeRenderer(window.innerWidth, window.innerHeight);
		},

		//gif factory status
		setBusy: function(){
			this.state.busy = true;
		},
		setFree: function(){
			this.state.busy = false;
		},

		//renderer
		startLoop: function(){
			this.app.startLoop();
		},
		stopLoop: function(){
			this.app.stopLoop();
		},

		//resetStore
		setUp: function(){
			//reset data
			this.frameData = [];
			this.rotations = [];

			//reset State
			this.state.count = 0;

			//
			this.setBusy();
			this.stopLoop();
			this.updateRendererForGif();
		},
		cleanUp: function(){
			this.updateRendererForApp();
			this.startLoop();
			this.setFree();
		},
		//
		checkFinish: function(beginTime){
			return (	(new Date()).getTime()  >= (beginTime + this.config.timeLength)		);
		},
		takeScreenShot: function(){
			return this.app.renderer.domElement.toDataURL();
		},
		//firefox doesn't seemed to be able to reuse image...
		//without this... kinda flaky...
		makeImgObj: function(dataURL, fnc){
			var img = new Image();
			if (!!!dataURL){
				throw new Error('requires dataURL');
			}
			img.onload = fnc;
			img.src = dataURL;
			return img;
		},
		collectScreenShot:function(){
			var dataURL = this.takeScreenShot();
			var self = this;

			this.state.count++;

			var imgObj = null;
			imgObj = this.makeImgObj(dataURL, function(){
				self.frameData.push(this);
				self.rotations.push(0);
			});

			// document.getElementById('apwgl-slider').appendChild(imgObj);

			// debugger;
		},
		requestMakeGif: function(){
			var self = this;


			var timerID = setInterval(function requestGif(){
				console.log('requestGif');
				if (self.frameData.length === self.state.count){
					clearTimeout(timerID);
					self.makeGIF();
				}
			},100);

		},

		//PUBLIC API
		start: function(force){
			var self = this;
			if (this.state.busy && !!!force){
				console.warn('already started.');
				return;
			}
			this.setUp();
			datGUI.obj.close();


			if (!!this.indicator){
				self.indicator.html($templateCache.get('views/loading.html'));
			}

			var startTime = (new Date()).getTime();
			var timerID = setInterval(function(){
				console.log('capturing frame');

				self.app.render();
				self.collectScreenShot();

				if (self.checkFinish(startTime)){
					clearTimeout(timerID);
					self.requestMakeGif();
				}
			},this.config.frameDelay);

			return 'started';
		},
		makeGIF: function(){
			console.log('start making gif :)');

			new MFAnimatedGIF({
				frameData: this.frameData,
				rotations: this.rotations,
				delay : this.config.frameDelay,
				repeat: 0,

				sHeight: this.config.size.source.height,
				sWidth: this.config.size.source.width,

				gHeight: this.config.size.gif.height,
				gWidth: this.config.size.gif.width,

				//event handlr for worker msg, executed in window scope.
				done: this.prebind.done,
				progress: this.prebind.progress,
				error: this.prebind.error,
			});
		},

		//http://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
		downloadFile: function(info){
			var saveData = (function () {
				var a = document.createElement('a');
				document.body.appendChild(a);
				a.style = 'display: none';
				return function (data, fileName) {
					// var json = JSON.stringify(data),
					// var blob = new Blob([json], {type: 'octet/stream'}),
					var blob = new Blob([data], {type: 'octet/stream'}),
					url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = fileName;
					a.click();
					window.URL.revokeObjectURL(url);
					a = null;
				};
			}());

			var fileName = 'gif.gif';

			saveData(info.buffer, fileName);
		},

		displayResult: function(info){
			window.gifResult = arguments;

			this.addTask(function(){
				var image = new Image();
				image.width = this.config.size.gif.width;
				image.height = this.config.size.gif.height;
				image.src = info.dataURL;
				document.getElementById('apwgl-slider').appendChild(image);
			});
			frbT.digest();

		},

		//event handlr for worker msg
		done: function(info){
			this.cleanUp();
			// this.downloadFile(info);
			this.displayResult(info);

			datGUI.obj.open();

			if (!!this.indicator){
				this.indicator.html('');
			}
		},
		lastFrame: null,
		progress: function(info){
			var tick = 0;
			if (this.lastFrame === null){
				tick = 0;
			}else{
				tick = window.performance.now() - this.lastFrame;
			}

			if (!!this.indicator){
				this.indicator.html((info * 100).toFixed(0));
			}

			this.lastFrame = window.performance.now();
			console.log('progress', (info * 100).toFixed(2), tick.toFixed(2));
		},
		error: function(info){
			this.setFree();
			console.log(info);
		},



	};

	return new GifMaker();
});
