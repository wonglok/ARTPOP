'use strict';

angular.module('artpopApp')
.factory('ShaderBank', function ($cacheFactory, Banker, ShaderSpiky, ShaderSun) {

	function ShaderBank(){
		this.cache = $cacheFactory('shaderBank');
		this.factories = {
			spiky: function(param){
				var shader = new ShaderSpiky();
				shader.init(param);
				return shader;
			},

			sun: function(param){
				var shader = new ShaderSun();
				shader.init(param);
				return shader;
			},


		};
	}
	ShaderBank.prototype = Object.create(Banker.prototype);
	return ShaderBank;
})
.factory('shaderBank', function (ShaderBank) {
	return new ShaderBank();
});



















/**/