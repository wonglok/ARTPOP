'use strict';

angular.module('artpopApp')
.factory('ShaderBank', function ($cacheFactory, Banker, ShaderSpiky) {

	function ShaderBank(){
		this.cache = $cacheFactory('shaderBank');
		this.factories = {
			spiky: function(){
				var spiky = new ShaderSpiky();
				// spiky.factors.mode = 'spiky';
				spiky.init();
				return spiky;
			},
			// honey: function(){
			// 	var spiky = new ShaderSpiky();
			// 	spiky.init();
			// 	return spiky;
			// }
		};
	}
	ShaderBank.prototype = Object.create(Banker.prototype);
	return ShaderBank;
})
.factory('shaderBank', function (ShaderBank) {
	return new ShaderBank();
});



















/**/