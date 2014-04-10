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
			size: {
				renderer: {
					width: 480,
					height: 480
				},
				gif: {
					width: 240,
					height: 240
				}
			},
			timeLength: 1000*1.2,
			frameDelay: 1000/30,

		};

		this.prebind = {
			done: this.done.bind(this),
			error: this.error.bind(this),
			progress: this.progress.bind(this),
		};


		this.app = null;

		this.count = 0;
		this.frameData = [];
		this.rotations = [];

	}
	GifMaker.prototype = {
		constructor: GifMaker,
		//app section
		addTask: function(tsk){
			frbT.addTask({
				ctx: this,
				fn: tsk
			});
		},
		switchTo: function(app){
			this.app = app;
		},
		takeScreenShot: function(){
			return this.app.renderer.domElement.toDataURL('image/png');
		},
		resizeForGif: function(){
			var source = this.config.size.renderer;
			var width = source.width;
			var height = source.height;

			this.app.resizeRenderer(width, height);
			this.app.renderer.domElement.style.width = '100%';
		},
		resizeForWindow : function(){
			this.app.resizeRenderer(window.innerWidth, window.innerHeight);
		},




		//
		setBusy: function(){
			this.state.busy = true;
		},
		setFree: function(){
			this.state.busy = false;
		},

		//
		setUp: function(){
			//reset data
			this.count = 0;
			this.frameData = [];
			this.rotations = [];

			//reset data
			this.setBusy();
			this.resizeForGif();



		},
		cleanUp: function(){
			this.setFree();
			this.resizeForWindow();
		},
		//
		checkFinish: function(beginTime){
			return (	(new Date()).getTime() < beginTime + this.config.timeLength		);
		},

		start: function(){
			if (this.state.busy){
				console.warn('already started.');
				return;
			}
			this.state.busy = true;

			var self = this;
			var app = self.app;


			this.setUp();
			var startTime = (new Date()).getTime();
			var timerID = setInterval(function(){
				console.log('capturing frame');

				app.render();

				var dataURL = self.takeScreenShot();
				self.frameData.push(dataURL);
				self.rotations.push(0);

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
			this.displayResult(info);
		},
		progress: function(info){
			console.log('progress', info * 100);
		},
		error: function(info){
			console.log(info);
		},



	};

	return new GifMaker();
});
