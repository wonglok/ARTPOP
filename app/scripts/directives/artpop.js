'use strict';
/* global Modernizr */
angular.module('artpopApp')
.directive('artpop', function (APWGLAPP) {


	var app = new APWGLAPP();
	window.apwgl = app;
	app.init();


	return {
		//template: '',
		restrict: 'E',
		transclude: true,
		link: function($scope, $element, $transclude){
			if (Modernizr.webgl){
				app.reconfig($scope, $element);
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
		}
	};
});





/**/