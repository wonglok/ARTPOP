'use strict';

angular.module('artpopApp')
.factory('ShaderBank', function ($cacheFactory, Banker, $injector) {

	function ShaderBank(){
		this.cache = $cacheFactory('shaderBank');
		this.factories = {
			spiky: function(param){
				var ShaderSpiky = $injector.get('ShaderSpiky');
				var shader = new ShaderSpiky();
				shader.init(param);
				return shader;
			},

			bubbles: function(param){
				var ShaderBubble = $injector.get('ShaderBubble');
				var shader = new ShaderBubble();
				shader.init(param);
				return shader;
			},

			sun: function(param){
				var ShaderSun = $injector.get('ShaderSun');
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