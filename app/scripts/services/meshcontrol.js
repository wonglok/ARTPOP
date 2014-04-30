'use strict';
/* global Modernizr,THREE */
angular.module('artpopApp')
.factory('MeshControl', function (CustomControl) {
	// Service logic
	// ...
	function MeshControl(){
		this.mesh = null;
		this.factors = {};
		this.ctr = new CustomControl();
		this.clock = new THREE.Clock();
	}
	MeshControl.prototype.constructor = MeshControl;

	MeshControl.fn = MeshControl.prototype;
	MeshControl.prototype.reconfig = function(mesh) {
		this.mesh = mesh;
	};
	MeshControl.prototype.resetCtrDefaults = function() {
		this.factors = this.factors || {};
		this.factors.speed = 1;
		this.factors.rotateX = false;
		this.factors.rotateY = false;
		this.factors.rotateZ = true;

		this.factors.moveX = false;
		this.factors.moveY = false;
		this.factors.moveZ = false;
	};
	MeshControl.fn.setUpCtr = function(){
		this.resetCtrDefaults();

		this.ctr.addFolder('Mesh');

		this.ctr.folder.add(this.factors, 'speed', -3,3).listen();

		this.ctr.folder.add(this.factors, 'rotateX').listen();
		this.ctr.folder.add(this.factors, 'rotateY').listen();
		this.ctr.folder.add(this.factors, 'rotateZ').listen();

		this.ctr.folder.add(this.factors, 'moveX').listen();
		this.ctr.folder.add(this.factors, 'moveY').listen();
		this.ctr.folder.add(this.factors, 'moveZ').listen();

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
			mesh = this.mesh,
			clock = this.clock,

			elapsed = clock.getElapsedTime();

		if (factors.rotateX){
			mesh.rotation.x += factors.speed / 150;
		}
		if (factors.rotateY){
			mesh.rotation.y += factors.speed / 150;
		}
		if (factors.rotateZ){
			mesh.rotation.z += factors.speed / 150;
		}

		if (factors.moveX){
			mesh.position.x = 10 * Math.sin(factors.speed * 2 * elapsed);
		}
		if (factors.moveY){
			mesh.position.y = 10 * Math.sin(factors.speed * 2 * elapsed);
		}
		if (factors.moveZ){
			mesh.position.z = 10 * Math.sin(factors.speed * 2 * elapsed);
		}



	};

	return MeshControl;
})
.factory('meshControl', function (MeshControl) {
	return new MeshControl();
});
