'use strict';
///* global base64 */
/* global $ */
angular.module('artpopApp')
.factory('MFAnimatedGIF', function (InlineWorkerFactory, $templateCache) {
	// Service logic
	// ...

	//Kudos:
	//h5bp/h5MFAnimatedGif github

	/*
	// new MFAnimatedGIF({
	// 	images: [ new Image(), new Image() ],
	// 	rotations: [ 0, 0],
	// 	delay : 300,
	// 	quality : 3,
	// 	repeat: 0,
	// 	height: 200,
	// 	width : 200,
	// 	progress: function(){ console.dir(arguments); },
	// 	done: function(){ console.dir(arguments); }
	// });

	*/

	var workerFactory = new InlineWorkerFactory();

	// handles interfacing with omggif-worker.js
	function MFAnimatedGIF(opts) {

		// var addTask = function(tsk){
		// 	frbT.addTask({
		// 		ctx: this,
		// 		fn: tsk
		// 	});
		// };

		var _rotate = function(image, rotation) {
			var canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			var ctx = canvas.getContext('2d');
			ctx.translate(image.width/2, image.height/2);
			ctx.rotate(rotation * Math.PI / 180.0);
			ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
			ctx.rotate(rotation * Math.PI / 180.0);
			ctx.translate(-image.width/2, -image.height/2);

			return canvas;
		};

		// //http://www.html5rocks.com/en/tutorials/canvas/hidpi/
		var _getRatio = function(context){
			var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio = context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1,
			ratio = devicePixelRatio / backingStoreRatio;

			return ratio;
		};

		// //http://www.html5rocks.com/en/tutorials/canvas/hidpi/
		// var _highdpi = function(canvas, context){
		// 	// finally query the various pixel ratios
		// 	var ratio = _getRatio(context);
		// 	if (ratio !== 1){
		// 		//
		// 		var oldWidth = canvas.width;
		// 		var oldHeight = canvas.height;
		// 		//rezie the canvas
		// 		canvas.width = oldWidth * ratio;
		// 		canvas.height = oldHeight * ratio;
		// 		//fix the geometry
		// 		canvas.style.width = oldWidth + 'px';
		// 		canvas.style.height = oldHeight + 'px';
		// 		context.scale(1/ratio, 1/ratio);
		// 	}else{
		// 	}
		// };

		var _initialize = function(opts) {

			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');

			var ratio = opts.ratio || _getRatio(context);


			canvas.width  = opts.gWidth;
			canvas.height = opts.gHeight;

			canvas.width  *= ratio;
			canvas.height *= ratio;

			// context.scale(ratio, ratio);

			//bucket
			var frameBucket = [],
				transferableList = [];

			//canvas loop
			var i, frameLength = opts.frameData.length,
				eachRotation,
				eachFrame,
				eachSrcImg,
				eachGifData,
				eachGifFrame;


			// document.getElementById('apwgl-slider').appendChild(canvas);


			for(i = 0; i< frameLength; i++) {
				eachFrame = opts.frameData[i];
				eachRotation = opts.rotations[i];

				//sometimes it could be...
				//eachDataURL = eachFrame;

				eachSrcImg = eachFrame;
				// eachSrcImg.width  = opts.sWidth;
				// eachSrcImg.height = opts.sHeight;


				if (eachRotation !== 0){
					eachSrcImg = _rotate(eachSrcImg, opts.rotations[i]);
				}

				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(eachSrcImg,
					0, 0,
					eachSrcImg.width * ratio, eachSrcImg.height * ratio,
					0, 0,
					canvas.width, canvas.height
				);
				eachGifData = context.getImageData(0, 0, canvas.width, canvas.height);


				// frameData.push(eachGifData);

				eachGifFrame = {
					data: _transferableArray(eachGifData.data),
					height: canvas.height,
					width: canvas.width
				};
				frameBucket.push(eachGifFrame);
				transferableList.push(eachGifFrame.data.buffer);
			}

			var gifWorker;
			//gifWorker = new Worker('workers/omggif-worker.js');

			gifWorker = workerFactory.spawn({
				deps: [
					// ['_transferableArray',_transferableArray],
					// ['mimivela', function mimivela(){ return 'ok'; }],
					// ['mimivela2', function mimivela2(){ return 'ok2'; }],
					// ['mimivela3', function mimivela3(){ return 'ok3'; }]
				],
				noopImportScript: true,
				imports: [
					$templateCache.get('workers/min/base64.js'),
					$templateCache.get('workers/min/NeuQuant.js'),
					$templateCache.get('workers/min/omggif.js'),
					$templateCache.get('workers/min/omggif-worker.js')
				]
				// fn: function(self){
				// 	var result = self.mimivela();
				// 	result += self.mimivela2();
				// 	result += self.mimivela3();
				// 	self.postMessage(result);
				// },
			});


			function onMessageHandler(e) {
				if (e.data.type === 'progress') {
					//Percent done, 0.0-0.1
					opts.progress(e.data.data);
				} else if (e.data.type === 'gif') {
					var info = e.data;

					info.blobURL = _blobURL( e.data.data );
					info.rawBase64URL = _rawBase64URL( e.data.data );
					// info.dataURL = _dataURL( info.rawBase64URL );

					//they can use
					//info.buffer and then blob it. and download it.
					//into.dataURL directly it is base64 encoded @ worker.

					opts.done(info);
					gifWorker.removeEventListener('message', onMessageHandler, false);
				}
			}
			function onErrorHandler(e) {
				opts.error(e);
				gifWorker.removeEventListener('error', onErrorHandler, false);
				gifWorker.terminate();
			}

			gifWorker.addEventListener('message', onMessageHandler, false);
			gifWorker.addEventListener('error', onErrorHandler, false);

			var message = {
				frames: frameBucket,
				delay: opts.delay,
				matte: [255, 255, 255],
			//	transparent: [0, 0, 0]
				transparent: false
			};

			gifWorker.postMessage(message, transferableList);
			// gifWorker.postMessage(message);

		};

		var _rawBase64URL = function(data) {
			return $.base64.encode(data);
		};

		// var _dataURL = function(rawData) {
		// 	return 'data:image/gif;base64,' + rawData;
		// };

		var _blobURL = function(data) {
			window.URL = window.URL || window.webkitURL;
			var blob = new Blob([data], {type: 'image/gif'});
			return window.URL.createObjectURL(blob);
		};

		var _transferableArray = function(data) {
			var uInt8View = new Uint8Array(new ArrayBuffer(data.length));
			//var viewLength = uInt8View.length;
			var i;
			var length = data.length - 1;
			for (i = 0; i <= length; ++i) {
				uInt8View[i] = data[i];
			}
			data = null;
			return uInt8View;
		};


		_initialize(opts);

	}





	// Public API here
	return MFAnimatedGIF;
});
