'use strict';

angular.module('artpopApp')
.directive('gifMaker', function (gifMaker, Modernizr) {
	return {
		template: '<a href="#"><span class="gif-indicator"></span></a>',
		restrict: 'E',
		link: function postLink(scope, element) {
			if (Modernizr.webgl){
				gifMaker.indicator = element.find('span');
				// console.log(gifMaker.indicator);
				element.bind('click',function(){
					gifMaker.start();
				});
			}
		}
	};
});
