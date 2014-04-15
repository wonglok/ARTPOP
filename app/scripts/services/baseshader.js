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
			this.cleanUpMesh();
			this.cleanUpCtr();
		},
		cleanUpMesh: function(){
			if (this.mesh){
				this.mesh.material = null;
				this.mesh = null;
			}
		},
		cleanUpCtr: function(){
			if (this.ctr){
				this.ctr.removeAll();
			}
		},
	};

	return BaseShader;
});
