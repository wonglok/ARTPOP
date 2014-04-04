'use strict';
/* global Modernizr */
angular.module('artpopApp')
.directive('artpop', function (ARTPOP) {
	return {
		template: '<div class="gl-canvas-container"></div>',
		restrict: 'E',
		transclude: true,
		controller: function ($scope, $element, $transclude) {
			if (Modernizr.webgl){
				ARTPOP.configDom($element);
				ARTPOP.configRenderer($element);
				ARTPOP.setUpEvents($scope);
				ARTPOP.startLoop();
			}else{
				$element.find('.gl-canvas-container').html($transclude());
			}
		}
	};
});
