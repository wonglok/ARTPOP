'use strict';
/* global base64 */
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


	new MFAnimatedGIF({
		images: frame,
		rotations: rotations,
		delay : 1000/20,
		quality : 3,
		repeat: 0,
		height: 320,
		width : 320,
		progress: function(info){
			console.log('progress', info * 100);
		},// console.dir(arguments);
		done: function(info){
			//info.rawDataURL
			//info.binaryURL //blob, use href
			//info.dataURL //base64, src string.

			var image;
			image = new Image();
			image.src = info.dataURL;
			document.getElementById('apwgl-slider').appendChild(image);

			that.enableSkipFrame();
			that.startLoop();

		}
	});

	var img = new Image();
		img.src = that.takeScreenShot();
		frame.push(img);
		rotations.push(0);

	*/

	var workerFactory = new InlineWorkerFactory();

	// handles interfacing with omggif-worker.js
	function MFAnimatedGIF(opts) {

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


		var _getImgObj = function(img, src){
			img.src = src;
			return img;
		};

		var _initialize = function(opts) {

			var img = new Image();
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			canvas.width  = opts.width;
			canvas.height = opts.height;



			var frameData = [],
				transferableList = [];

			var i, frameLength = opts.dataURLs.length,
				eachRotation,
				eachImgURL,
				eachImg,
				eachCanvasData,
				eachFrameInfo;

			for(i = 0; i< frameLength; i++) {
				eachRotation = opts.rotations[i];
				eachImgURL = opts.dataURLs[i];
				eachImg = _getImgObj(img,eachImgURL);

				if (eachRotation !== 0){
					eachImg = _rotate(eachImg, opts.rotations[i]);
				}

				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(eachImg, 0, 0, eachImg.width, eachImg.height, 0, 0, canvas.width, canvas.height);
				eachCanvasData = context.getImageData(0, 0, canvas.width, canvas.height);

				eachFrameInfo = {
					data: _transferableArray(eachCanvasData.data),
					height: canvas.height,
					width: canvas.width
				};
				frameData.push(eachFrameInfo);
				transferableList.push(eachFrameInfo.data.buffer);
			}





			var gifWorker;
			//gifWorker = new Worker('workers/omggif-worker.js');
			gifWorker = workerFactory.spawn({
				deps: [
					['_transferableArray',_transferableArray],
					// ['mimivela', function mimivela(){ return 'ok'; }],
					// ['mimivela2', function mimivela2(){ return 'ok2'; }],
					// ['mimivela3', function mimivela3(){ return 'ok3'; }]
				],
				noopImportScript: true,
				imports: [
					$templateCache.get('workers/NeuQuant.js'),
					$templateCache.get('workers/omggif.js'),
					$templateCache.get('workers/omggif-worker.js')
				]
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
					opts.progress(e.data.data);
				} else if (e.data.type === 'gif') {
					var info = e.data;
					info.binaryURL = _blobURL( e.data.data );
					info.rawDataURL = _rawDataURL( e.data.data );
					info.dataURL = _dataURL( info.rawDataURL );
					opts.done(info);
				}
			}, false);

			gifWorker.addEventListener('error', function (e) {
				opts.error(e);
				gifWorker.terminate();
			}, false);

			var message = {
				frames: frameData,
				delay: opts.delay,
				matte: [255, 255, 255],
			//	transparent: [0, 0, 0]
				transparent: false
			};

			gifWorker.postMessage(message, transferableList);

		};

		var _rawDataURL = function(data) {
			return base64.encode(data);
		};

		var _dataURL = function(rawData) {
			return 'data:image/gif;base64,' + rawData;
		};

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
