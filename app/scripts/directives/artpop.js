'use strict';
/* global Modernizr */
angular.module('artpopApp')
.directive('artpop', function (APWGLAPP) {

	var app = new APWGLAPP();
	window.apwgl = app;
	app.init();

	return {
		template: '<div class="gl-canvas-container"></div>',
		restrict: 'AE',
		transclude: true,
		link: function($scope, $element, $transclude){
			var container = $element[0].querySelector('.gl-canvas-container');

			if (Modernizr.webgl){
				app.reconfig($scope, $element, container);
			}else{
				container.appendChild($transclude());
			}
		}
	};
});





/**/