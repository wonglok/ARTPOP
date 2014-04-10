'use strict';

angular.module('artpopApp')
.factory('gifMaker', function (MFAnimatedGIF, frbT) {
	// Service logic
	// ...
	function GifMaker(){
		this.state = {
			busy: false
		};
		this.config = {
			timeLength: 1000*5,
			frameDelay: 1000/24,
			size: {
				sourceImage: {
					width: 320,
					height: 320
				},
				gif: {
					width: 240,
					height: 240
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

			if (rAspect >= 1){
				renEl.style.width = '';
				renEl.style.height = '100%';
			}else{
				renEl.style.width = '100%';
				renEl.style.height = '';
			}
		},
		restoreFit: function(){
			var renEl = this.app.renderer.domElement;
			renEl.style.width = '';
			renEl.style.height = '';
		},

		updateRendererForGif: function(){
			var source = this.config.size.sourceImage;
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
			return (	(new Date()).getTime() < beginTime + this.config.timeLength		);
		},
		takeScreenShot: function(){
			return this.app.renderer.domElement.toDataURL('image/png');
		},
		collectScreenShot:function(){
			var dataURL = this.takeScreenShot();
			this.frameData.push(dataURL);
			this.rotations.push(0);
		},
		start: function(){
			if (this.state.busy){
				console.warn('already started.');
				return;
			}
			this.state.busy = true;

			var self = this;

			this.setUp();
			var startTime = (new Date()).getTime();
			var timerID = setInterval(function(){
				console.log('capturing frame');

				self.app.render();
				self.collectScreenShot();

				if (!self.checkFinish(startTime)){
					clearTimeout(timerID);
					console.log('start making gif :)');
					self.makeGIF();
				}
			},this.config.frameDelay);
		},
		makeGIF: function(){

			new MFAnimatedGIF({
				dataURLs: this.frameData,
				rotations: this.rotations,
				delay : this.config.frameDelay,
				repeat: 0,

				height: this.config.size.gif.height,
				width: this.config.size.gif.width,

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

			var fileName = 'my-download.gif';

			saveData(info.buffer, fileName);
		},

		displayResult: function(info){
			window.gifResult = arguments;

			this.addTask(function(){
				var image = new Image();
				image.src = info.dataURL;
				document.getElementById('apwgl-slider').appendChild(image);
			});
			frbT.digest();

		},

		//event handlr for worker msg
		done: function(info){
			this.cleanUp();
			this.downloadFile(info);
			this.displayResult(info);
		},
		lastFrame: null,
		progress: function(info){
			var tick = 0;
			if (this.lastFrame === null){
				tick = 0;
			}else{
				tick = window.performance.now() - this.lastFrame;
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
