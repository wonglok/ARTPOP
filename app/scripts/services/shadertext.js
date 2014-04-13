'use strict';

angular.module('artpopApp')
.factory('ShaderText', function ($templateCache) {
	return {
		spiky :{
			vs: $templateCache.get('shaders/spiky.vs'),
			fs: $templateCache.get('shaders/spiky.fs')
		}
	};
});


