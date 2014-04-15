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

		//limit?
		this._ratio = ((this.ratio >= 2) ? 2 : this.ratio );


		this.config = {
			timeLength: 1000*3,
			frameDelay: 1000/24,
			size: {
				source: {
					//for high dpi devices. use lower logical pixel.
					//use same pixel amount as the souce.
					width: (this.ratio > 1) ? 160 : 340,
					height: (this.ratio > 1) ? 160 : 340
				},
				gif: {
					width: (this.ratio > 1) ? 160: 256,
					height: (this.ratio > 1) ? 160: 256
				}
			},
			autoDownload: false,
			displayGif: true
		};
		this.prebind = {
			done: this.done.bind(this),
			error: this.error.bind(this),
			progress: this.progress.bind(this),
		};


		this.app = null;

		this.frameData = [];
		this.rotations = [];
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

			//css width
			img.onload = fnc;
			img.src = dataURL;
			return img;
		},
		collectScreenShot:function(){
			var dataURL = this.takeScreenShot();
			var self = this;

			var imgObj = null;
			imgObj = this.makeImgObj(dataURL, function(){
				self.frameData[this.state.count](this);
				self.rotations.push(0);
			});

			this.state.count++;

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


			var frameID = 0;
			var startTime = (new Date()).getTime();
			var timerID = setInterval(function(){
				console.log('capturing frame');

				frameID++;
				if (!!self.indicator){
					self.indicator.html('Snapshot '+frameID);
				}

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
				var anchor = document.createElement('a');
				document.body.appendChild(anchor);
				anchor.style = 'display: none';
				return function (data, fileName) {
					// var json = JSON.stringify(data),
					// var blob = new Blob([json], {type: 'octet/stream'}),
					var blob = new Blob([data], {type: 'octet/stream'}),
					url = window.URL.createObjectURL(blob);
					anchor.href = url;
					anchor.download = fileName;
					anchor.click();

					window.URL.revokeObjectURL(url);
					anchor.parentNode.removeChild(anchor);
					anchor = null;
				};
			}());

			var fileName = 'gif.gif';

			saveData(info.buffer, fileName);
		},

		displayResult: function(info){
			window.gifResult = arguments;

			this.addTask(function(){

				var blob = new Blob([info.buffer], {type: 'octet/stream'}),
				url = window.URL.createObjectURL(blob);



				var anchor = document.createElement('a');
				anchor.href = url;
				anchor.download = 'gif.gif';

				var image = new Image();
				image.src = url;//info.dataURL;
				// image.width = this.config.size.gif.width;
				// image.height = this.config.size.gif.height;

				anchor.appendChild(image);

				document.getElementById('apwgl-slider').appendChild(anchor);
			});
			frbT.digest();

		},

		//event handlr for worker msg
		done: function(info){
			this.cleanUp();
			if (this.config.autoDownload){
				this.downloadFile(info);
			}
			if (this.config.displayGif){
				this.displayResult(info);
			}

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
				this.indicator.html('Export '+(info * 100).toFixed(0)+'%');
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
