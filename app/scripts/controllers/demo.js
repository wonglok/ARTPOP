'use strict';

angular.module('artpopApp')
.controller('DemoCtrl', function ($scope) {

	$scope.demoImages = [];
	for (var i = 17; i > 0; i--) {
		$scope.demoImages.push('./images/demo/'+(i)+'.gif');
	}

});
