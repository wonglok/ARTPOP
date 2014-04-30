'use strict';

angular.module('artpopApp')
.controller('DemoCtrl', function ($scope) {
	$scope.demoImages = [];
	$scope.totalImages = 19;
	function addImg(i){
		setTimeout(function(){
			console.log('add image');
			$scope.demoImages.push('./images/demo/'+(i)+'.gif');
			$scope.$digest();
		},i*1000);
	}

	for (var i = $scope.totalImages; i > 0; i--) {
		addImg(i);
	}

});
