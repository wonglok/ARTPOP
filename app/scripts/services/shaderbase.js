'use strict';

angular.module('artpopApp')
.factory('BaseShader', function () {
	// Service logic
	// ...
	function BaseShader(){
	}
	BaseShader.prototype = {
		init: BaseShader,
		constructor: BaseShader,
		update: function(){

		},
		cleanUp: function(){

			if (this.mesh){
				this.mesh.material = null;
				this.mesh = null;
			}
			if (this.scene){
				this.scene = null;
			}

			if (this.renderer){
				this.renderer = null;
			}
			if (this.ctr){
				this.ctr.removeAll();
			}

		},
	};

	return BaseShader;
});
