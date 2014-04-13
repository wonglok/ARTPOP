'use strict';
///* global THREE */
angular.module('artpopApp')
.factory('APWGLAPP', function (X3, shaderBank, meshBank, CustomControl) {
	// Service logic
	// ...

	function APWGLAPP(){
		X3.call(this);

		this.parent = X3.prototype;

		this.ctr = new CustomControl();
		this.factors = {
			mesh: null,
			shader: null,
			shaderUpdater: null
		};

		this.select = {
			mesh: Object.keys(meshBank.factories),
			shader: Object.keys(shaderBank.factories)
		};

		this.prebind = this.prebind || {};
		this.prebind.onChangeMesh = this.onChangeMesh.bind(this);


	}
	APWGLAPP.prototype = Object.create(X3.prototype);
	APWGLAPP.prototype.constructor = APWGLAPP;

	//------------------------
	APWGLAPP.fn = APWGLAPP.prototype;
	APWGLAPP.fn.init = function(){
		this.parent.init.call(this);


		this.setUpCtr();

		this.useMesh();
		this.useShader();

	};

	APWGLAPP.fn.setUpCtr = function(){
		this.ctr.addFolder('Meshes');
		// this.ctr.folder.add(this.factors, 'mesh', this.select.mesh);
	};
	APWGLAPP.fn.setUpShaderCtr = function(){
	};
	APWGLAPP.fn.onChangeMesh = function(){

	};
	APWGLAPP.fn.ditchMesh = function(){
		if (this.factors.mesh){
			//delete last item
			this.scene.remove( this.factors.mesh );
		}
	};
	APWGLAPP.fn.ditchShader = function (){
		if (this.factors.shader){
			//clear last shader
			this.shader.cleanUpCtr();
		}
	};
	APWGLAPP.fn.useMesh = function (){
		var mesh = meshBank.getLazy('sphere');
		this.factors.mesh = mesh;
	};
	APWGLAPP.fn.useShader = function (){
		var shader = shaderBank.getLazy('spiky');

		shader.reconfig({
			mesh: this.factors.mesh,
			url: 'textures/disturb.jpg'
		});


		//set current
		this.factors.shader = shader;
		this.factors.shaderUpdater = shader.prebind.update;
		shader.setUpCtr();


		this.scene.add( this.factors.mesh  );

		//this.updateStack.push();
	};
	APWGLAPP.fn.update = function(){
		if (typeof this.factors.shaderUpdater === 'function'){
			this.factors.shaderUpdater();
		}

	};



	// Public API here
	return APWGLAPP;
});
