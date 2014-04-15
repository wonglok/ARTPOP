'use strict';
/* global Modernizr */
angular.module('artpopApp')
.factory('MeshControl', function (CustomControl) {
	// Service logic
	// ...
	function MeshControl(){
		this.mesh = null;
		this.factors = {};
		this.ctr = new CustomControl();
	}
	MeshControl.prototype.constructor = MeshControl;

	MeshControl.fn = MeshControl.prototype;
	MeshControl.prototype.reconfig = function(mesh) {
		this.mesh = mesh;
	};
	MeshControl.prototype.resetCtr = function() {
		this.factors = this.factors || {};
		this.factors.speed = 1;
		this.factors.rotateX = false;
		this.factors.rotateY = false;
		this.factors.rotateZ = true;
	};
	MeshControl.fn.setUpCtr = function(){
		this.resetCtr();

		this.ctr.addFolder('Mesh');

		this.ctr.folder.add(this.factors, 'speed', -3,3).listen();

		this.ctr.folder.add(this.factors, 'rotateX').listen();
		this.ctr.folder.add(this.factors, 'rotateY').listen();
		this.ctr.folder.add(this.factors, 'rotateZ').listen();


		if (!Modernizr.touch){
			this.ctr.folder.open();
		}

	};
	MeshControl.fn.cleanUpCtr = function(){
		this.ctr.removeAll();
	};
	MeshControl.fn.update = function(){
		if (!this.mesh){
			return;
		}
		var factors = this.factors,
			mesh = this.mesh;

		if (factors.rotateX){
			mesh.rotation.x += factors.speed / 50;
		}
		if (factors.rotateY){
			mesh.rotation.y += factors.speed / 50;
		}
		if (factors.rotateZ){
			mesh.rotation.z += factors.speed / 50;
		}
	};

	return MeshControl;
})
.factory('meshControl', function (MeshControl) {
	return new MeshControl();
});
