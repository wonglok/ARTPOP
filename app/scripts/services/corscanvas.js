'use strict';

angular.module('artpopApp')
	.factory('CORSCanvas', function (ObjPool, $q) {
		var canvasPool = new ObjPool('canvas');
		canvasPool.init({
			factory: function(){
				return document.createElement('canvas');
			}
		});
		var imagePool = new ObjPool('image');
		imagePool.init({
			factory: function(){
				return new Image();
			}
		});

		function downloadImage(obj, address){
			var deferred = $q.defer();
			var imgDom = obj.img;
			imgDom.onload = function() {
				deferred.resolve(obj);
			};
			imgDom.onerror = function() {
				deferred.reject(new Error('Network Error'));
			};
			imgDom.onprogress = function(event){
				deferred.notify(event);
			};
			//imgDom.crossOrigin = '';
			imgDom.crossDomain = '';
			imgDom.src = address;
			return deferred.promise;
		}


		function paintCanvas(obj){
			var deferred = $q.defer();
			var img = obj.img;
			var canvas = obj.canvas;

			setTimeout(function(){
				canvas.width = img.width;
				canvas.height = img.height;

				var ctx=canvas.getContext('2d');
				ctx.drawImage(img,0,0, img.width, img.height);

				deferred.resolve(obj);
			});

			return deferred.promise;
		}


		function getTexture(url){
			var newImage = imagePool.alloc();
			var newCanvas = canvasPool.alloc();

			return downloadImage({
				img: newImage.obj,
				canvas: newCanvas.obj
			}, url)
				.then(paintCanvas)
				.then(function(obj){
					//imagePool.reuse(newImage);
					return obj;
				});
		}

		// //return thenable
		return {
			getTexture: getTexture
		};
	});
