'use strict';
/* global THREE */
angular.module('artpopApp')
.factory('TextureBank', function ($cacheFactory, Banker) {
	function TextureBank(){
		this.cache = $cacheFactory('textureBank');
		this.factories = {
			oilPaint: function(){
				return THREE.ImageUtils.loadTexture('textures/disturb.jpg' );
			},
		};
	}
	TextureBank.prototype = Object.create(Banker.prototype);

	return TextureBank;
})
.factory('textureBank', function (TextureBank) {
	return new TextureBank();
});



















/**/