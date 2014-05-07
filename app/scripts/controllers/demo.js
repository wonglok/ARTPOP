'use strict';
/* global NProgress */
angular.module('artpopApp')
.controller('DemoCtrl', function ($scope) {
	$scope.demoImages = [];
	$scope.totalImages = 19;
	$scope.imageDone = 0;


	function addImg(i){
		setTimeout(function(){
			console.log('add image');
			$scope.demoImages.push({
				id: i,
				src: './images/demo/'+(i)+'.gif'
			});
			$scope.$digest();
		},i*100);
	}

	for (var i = $scope.totalImages; i > 0; i--) {
		addImg(i);
	}

})
.directive('demoOnLoad', function() {
	return {
		restrict: 'A',
		link: function(scope, element) {
			element.bind('load', function() {
				scope.$parent.imageDone++;

				var progress = scope.$parent.imageDone/scope.$parent.totalImages;
				if (progress === 1){
					scope.$parent.finished = true;
				}


				scope.$parent.$digest();
				NProgress.set(progress);
			});
			element[0].src = scope.eachImg.src;
		}
	};
});

