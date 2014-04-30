'use strict';
/* global THREE, Modernizr */
angular.module('artpopApp')
	.factory('ShaderSun', function (BaseShader, CustomControl, ShaderText) {
		function SunSahder(){
			//Shader Data


			var noiseTexture = new THREE.ImageUtils.loadTexture( 'textures/skip/cloud.png' );
			noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

			var lavaTexture = new THREE.ImageUtils.loadTexture( 'textures/lava.jpg' );
			lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

			// use "this." to create global object
			this.uniforms = {
				baseTexture:	{ type: 't', value: lavaTexture },
				baseSpeed:		{ type: 'f', value: 0.1 },

				noiseTexture:	{ type: 't', value: noiseTexture },
				noiseScale:		{ type: 'f', value: 1.0 },

				alpha:			{ type: 'f', value: 0.5 },
				time:			{ type: 'f', value: 1.0 }
			};

			this.select = {
				// mode: {
				// 	'honey Ball': 'honey',
				// 	'spiky Ball': 'spiky'
				// }
			};

			this.factors = {};

			this.ctr = null;
			this.clock = null;
			this.material = null;
		}
		SunSahder.prototype = Object.create(BaseShader.prototype);
		SunSahder.prototype.constructor = SunSahder;
		SunSahder.prototype.init = function(param){
			param = param || {};

			//clock
			this.clock = param.clock || new THREE.Clock();

			//Control
			this.ctr = new CustomControl();

			this.setFactors();

			//shader material
			this.material = new THREE.ShaderMaterial( {
				uniforms : this.uniforms,
				// attributes : this.attributes,
				vertexShader : ShaderText.sun.vs,
				fragmentShader : ShaderText.sun.fs,
				wireframe: false
			});

			this.material.side = THREE.DoubleSide;
		};
		SunSahder.prototype.setFactors = function(){
			//Control Factors
			this.factors = this.factors || {};

			this.factors.timerSpeed = 1;
			// this.factors.mode = 'spiky';
			// this.factors.moveWave = true;


			this.factors.rotateX = true;
			this.factors.rotateY = true;
			this.factors.rotateZ = true;
		};

		SunSahder.prototype.reconfig = function(param){
			param = param || {};
			// var uniforms = this.uniforms;

			//assign mesh
			this.mesh = param.mesh || (function(){ throw new Error('Requires Mesh.'); }());
			this.mesh.geometry.dynamic = true;

			this.mesh.material = this.material;

			// //assgin mesh
			// var noise = this.noise,
			// 	displacements = this.attributes.displacement.value,
			// 	vertices =  this.mesh.geometry.vertices;

			// //attribute data
			// for (var v = vertices.length - 1; v >= 0; v--) {
			// 	displacements[ v ] = 0;
			// 	noise[ v ] = Math.random() * 5;
			// }
			// this.attributes.displacement.needsUpdate = true;
		};

		SunSahder.prototype.setUpCtr = function(){

			this.ctr.addFolder('SunSahder');

			// this.ctr.folder.add(this.factors, 'mode', this.select.mode);

			// this.ctr.addCtr({
			// 	type: 'color',
			// 	name: 'Ball Color',
			// 	ctx: this.uniforms.color,
			// 	get: function(){
			// 		return '#'+this.value.getHexString();
			// 	},
			// 	set: function(val){
			// 		// val = val.replace('#','0x');
			// 		this.value.setStyle(val);
			// 	},
			// 	finish: function(){
			// 		console.log('ballcolr');
			// 		// this.value.offsetHSL(0,2,2);
			// 	},
			// });

			this.ctr.folder.add(this.factors, 'timerSpeed', -3,3).listen();

			this.ctr.addCtr({
				type: 'slider',
				name: 'Noise Scale',
				ctx: this.uniforms.noiseScale,
				get: function(){
					return this.value;
				},
				set: function( val ){
					this.value = val;
				},
				min: 0.1,
				max: 3,
				// step: 0.001
			});

			// this.ctr.addCtr({
			// 	type: 'slider',
			// 	name: 'Texture Shift',
			// 	ctx: this.uniforms.textureShift,
			// 	get: function(){
			// 		return this.value;
			// 	},
			// 	set: function( val ){
			// 		this.value = val;
			// 	},
			// 	min: -1.2,
			// 	max: 1.2,
			// 	// step: 0.001
			// });

			this.ctr.addCtr({
				type: 'checkbox',
				name: 'wireframe',
				ctx: this.material,
				get: function(){
					return this.wireframe;
				},
				set: function( val ){
					this.wireframe = val;
				},
			});

			// this.ctr.folder.add(this.factors, 'moveWave').listen();

			// this.ctr.folder.add(this.factors, 'rotateX').listen();
			// this.ctr.folder.add(this.factors, 'rotateY').listen();
			// this.ctr.folder.add(this.factors, 'rotateZ').listen();


			// this.ctr.folder.add(this, 'resetAnimation');

			if (!Modernizr.touch){
				this.ctr.folder.open();
			}
		};
		SunSahder.prototype.resetAnimation = function(){
			for(var key in this.uniforms){
				this.uniforms[key].animate = true;
			}
			this.setFactors();
		};
		SunSahder.prototype.update = function (){
			var factors = this.factors;
			// var uniforms = this.uniforms;
			// var attributes = this.attributes;

			// var mesh = this.mesh;
			// var noise = this.noise;

			var delta = this.clock.getDelta();

			this.uniforms.time.value += delta * factors.timerSpeed;

			this.ctr.syncController();

		};


		return SunSahder;
	});
