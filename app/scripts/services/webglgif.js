'use strict';
/* global base64*/
angular.module('artpopApp')
.factory('WebGLGif', function ($templateCache, workerFactory) {
	// Service logic
	// ...

	function WebGLGif(){
		this.config = {
			frameRate: 0.0,
			time: 0.0,
			screenShot: {
				width: 480,
				height: 480,
			},
			gif: {
				width: 240,
				height: 240,
			},
		};
		this.store = {
			rotate: null,
			dataURL: null,
			canvasImageData: null,
			transferableList: null
		};

		this.obj = {
			img: new Image(),
			rotate: {
				canvas: null,
				context: null
			},
			gif: {
				canvas: null,
				context: null
			}
		};
		this.prepCanvas(this.obj.rotate);
		this.prepCanvas(this.obj.gif);

		this.state = {
			busy: true,
			phase: {
				val: 0,
				//just a description of system state.
				desc: [
					'Init system',
					'Config system',
					'Collect WebGL Data',
					'Convert All DataURL To Img To CanvasData',
					'Convert Gif',
					'Clean Up',
					'Ready Reuse'
				]
			}
		};
	}

	/*
	[
		[0,dataURL]
		[90,dataURL]
	]
	*/


	WebGLGif.prototype = {
		constructor: WebGLGif,
		prepCanvas: function(target){
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			target = target || {};
			target.canvas = canvas;
			target.context = context;
		},
		config: function(param){
			param = param || {};
			//config
			this.config.frameRate = param.frameRate || 1000/24;
			this.config.time = param.time || 1000*25;
			this.config.done = param.done || function(info){ console.log('done',info); };
			this.config.error = param.error || function(info){ console.log('error',info); };
			this.config.progress = param.progress || function(info){ console.log('progress',info); };

			this.config.screenShot = param.screenShot|| {
				width: 320,
				height: 320,
			};
			this.config.gif = param.gif|| {
				width: 240,
				height: 240,
			};

		},
		_resue: function(){
			this._resetStore();
		},
		_resetStore: function(){
			//_resetStore
			this.store = {
				rotate: [],
				dataURL: [],
				canvasImageData: [],
				transferableList: []
			};

		},
		_rotateCanvas: function(image, rotation){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			canvas.width = image.width;
			canvas.height = image.height;
			ctx.translate(image.width/2, image.height/2);
			ctx.rotate(rotation * Math.PI / 180.0);
			ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
			ctx.rotate(rotation * Math.PI / 180.0);
			ctx.translate(-image.width/2, -image.height/2);

			return canvas;
		},
		_getSrcImg: function(src){
			var img = this.obj.img;
			img.src = src;
			return img;
		},
		_transferableArray : function(data) {
			var uInt8View = new Uint8Array(new ArrayBuffer(data.length));
			//var viewLength = uInt8View.length;
			var i;
			var length = data.length - 1;
			for (i = 0; i <= length; ++i) {
				uInt8View[i] = data[i];
			}
			data = null;
			return uInt8View;
		},
		_convertToFrameData: function(imgSource){
			var canvas = this.obj.gif.canvas;
			var context = this.obj.gif.canvas;

			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(imgSource, 0, 0, imgSource.width, imgSource.height, 0, 0, canvas.width, canvas.height);
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			//if no transferable obj.
			//return imageData;
			return {
				data: this._transferableArray(imageData.data),
				height: canvas.height,
				width: canvas.width
			};

		},
		_process: function(){
			var canvas = this.obj.gif.canvas;
			var config = this.config.gif;

			canvas.width  = config.width;
			canvas.height = config.height;

			var i;
			var frameLength = this.store.dataURL.length;
			var processor = this._processInternal;
			for (i = 0; i < frameLength; i++) {
				processor(i);
			}
		},
		_processInternal: function(i){
			var eachRotation = this.store.rotate[i];
			var eachDataURL = this.store.dataURL[i];

			//get image
			var img = this._getSrcImg(eachDataURL);
			//if roate make a rotated canvas
			var imgSource = (eachRotation === 0) ? img : this._rotateCanvas(img, eachRotation);
			//convert to frame data
			var eachFrame = this._convertToFrameData(imgSource);

			//push data to list
			this.canvasImageData.push(eachFrame);
			this.transferableList.push(eachFrame.data.buffer);
		},
		_imports: [
			$templateCache.get('workers/NeuQuant.js'),
			$templateCache.get('workers/omggif.js'),
			$templateCache.get('workers/omggif-worker.js')
		],

		_blobURL: function(data) {
			window.URL = window.URL || window.webkitURL;
			var blob = new Blob([data], {type: 'image/gif'});
			return window.URL.createObjectURL(blob);
		},
		_dataURL: function(rawData) {
			return 'data:image/gif;base64,' + rawData;
		},
		_rawDataURL: function(data) {
			return base64.encode(data);
		},
		convert: function(){
			this.state.busy = true;
			var self = this;
			var gifWorker;
			//gifWorker = new Worker('workers/omggif-worker.js');
			gifWorker = workerFactory.spawn({
				deps: [
					['_transferableArray',this._transferableArray],
					// ['mimivela', function mimivela(){ return 'ok'; }],
					// ['mimivela2', function mimivela2(){ return 'ok2'; }],
					// ['mimivela3', function mimivela3(){ return 'ok3'; }]
				],
				noopImportScript: true,
				imports: this._imports
				// fn: function(self){
				// 	var result = self.mimivela();
				// 	result += self.mimivela2();
				// 	result += self.mimivela3();
				// 	self.postMessage(result);
				// },
			});

			gifWorker.addEventListener('message', function (e) {
				if (e.data.type === 'progress') {
					//Percent done, 0.0-0.1
					self.config.progress(e.data.data);
				} else if (e.data.type === 'gif') {
					var info = e.data;
					info._blobURL = self._blobURL( e.data.data );
					info.rawDataURL = self._rawDataURL( e.data.data );
					info.dataURL = self._dataURL( info.rawDataURL );
					self.config.done(info);
					this.state.busy = true;
				}
			}, false);

			gifWorker.addEventListener('error', function (e) {
				self.config.error(e);
				gifWorker.terminate();
			}, false);

			gifWorker.postMessage({
				frames: this.store.canvasImageData,
				delay: this.config.frameRate,
				matte: [255, 255, 255],
				transparent: [0, 0, 0]
			}, this.store.transferableList);
		},
		collectFrame: function(dataURL, rotation){
			dataURL = dataURL || '';
			rotation = rotation || 0;
			//collect
			this.store.rotate.push(rotation);
			this.store.dataURL.push('');
		},
	};


	return WebGLGif;
});
