'use strict';

angular.module('artpopApp')
.factory('shaderBank', function ($cacheFactory, Banker, ShaderSpiky) {

	function ShaderBank(){
		this.cache = $cacheFactory('shaderBank');
		this.factories = {
			spiky: function(){
				var spiky = new ShaderSpiky();
				spiky.init();
				return spiky;
			}
		};
	}
	ShaderBank.prototype = Object.create(Banker.prototype);

	return new ShaderBank();
});



















/**/