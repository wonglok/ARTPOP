'use strict';

angular.module('artpopApp')
	.factory('CORSCanvas', function (ObjectPool, $q) {
		var corsCanvasPool = new ObjectPool();
		//
		corsCanvasPool.init({
			factory: function(){
				return {
					canvas: document.createElement('canvas'),
					img: document.createElement('canvas'),
				};
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
			imgDom.src = address;
			return deferred.promise();
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

				var result = canvas.toDataURI();

				deferred.resolve(result);
			});

			return deferred.promise();
		}


		function getTextrue(url){
			var newItem = corsCanvasPool.alloc();
			return downloadImage(newItem.imgDom, url)
				.then(paintCanvas)
				.then(function(result){
					newItem.reuse();
					return result;
				});
		}

		return getTextrue;
	});
