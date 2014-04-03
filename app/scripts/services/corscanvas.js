'use strict';

angular.module('artpopApp')
	.factory('CORSCanvas', function () {
		// function downloadImage(imgDom, address){
		// 	var deferred = $q.defer();
		// 	imgDom.onload = function() {
		// 		resolve(imgDom);

		// 	};
		// 	imgDom.onerror = function() {
		// 		reject(Error("Network Error"));
		// 	};
		// 	imgDom.src = address;
		// 	return deferred.promise();
		// }
		// function paintCanvas(image,canvas){
		// 	var deferred = $q.defer();

		// 	$timeout(function(){
		// 		canvas.width = img.width;
		// 		canvas.height = img.height;
		// 		var ctx=canvas.getContext("2d");
		// 		ctx.drawImage(img,0,0, img.width, img.height);

		// 		deferred.resolve(canvas);
		// 	});
		// 	return deferred.promise();
		// }

			// 	function asyncGreet(name) {
			// 		var deferred = $q.defer();

			// 		setTimeout(function() {
			// 			scope.$apply(function() {
			// 				deferred.notify('About to greet ' + name + '.');
			// 				if (okToGreet(name)) {
			// 					deferred.resolve('Hello, ' + name + '!');
			// 				} else {
			// 					deferred.reject('Greeting ' + name + ' is not allowed.');
			// 				}
			// 			});
			// 		}, 1000);

			// 		return deferred.promise;
			// 	}

			// 	var promise = asyncGreet('Robin Hood');
			// 	promise.then(function(greeting) {
			// 		console.log('Success: ' + greeting);
			// 	}, function(reason) {
			// 		console.log('Failed: ' + reason);
			// 	}, function(update) {
			// 		console.log('Got notification: ' + update);
			// 	});


			// function getImg(url) {
			// 	return new Promise(function(resolve, reject) {
			// 		var img = new Image();
			// 		img.onload = function() {
			// 			resolve(img);
			// 		};
			// 		img.onerror = function() {
			// 			reject(Error("Network Error"));
			// 		};
			// 		img.src = url;
			// 	});
			// }

			// function makeCanvas(img){
			// 		var canvas = document.createElement('canvas');
			// 		canvas.width = img.width;
			// 		canvas.height = img.height;

			// 		return [canvas,img];
			// 	//return Promise.resolve([canvas,img]);
			// }

			// function drawCanvas(data){
			// 	var canvas = data[0];
			// 	var img = data[1];
			// 	var ctx=canvas.getContext("2d");
			// 	ctx.drawImage(img,0,0);

			// 	return canvas;
			// }

			// function showCanvas(canvas){
			// 	document.body.appendChild(canvas);
			// }


			// var url = "http://upload.wikimedia.org/wikipedia/commons/9/9c/Image-Porkeri_001.jpg";


			// Promise.resolve(url)
			// .then(getImg)
			// .then(makeCanvas)
			// .then(drawCanvas)
			// .then(showCanvas)

			// ;


		return {

		};
	});
