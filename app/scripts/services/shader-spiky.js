'use strict';
/* global THREE */
angular.module('artpopApp')
	.factory('ShaderSpiky', function (CustomControl, ShaderText) {
		function SpikySahder(){
			//Shader
			this.attributes = {
				displacement: {
					type: 'f',
					value: [],
					needsUpdate: true
				}
			};
			this.uniforms = {
				textureShift: {
					type: 'f',
					value: 0.1,
					animate: true,
				},
				amplitude: {
					type: 'f',
					value: 0.1,
					animate: true,
				},
				color:     {
					type: 'c',
					value: null,
					animate: true,
				},
				texture:   {
					type: 't',
					value: null,
				}
			};
			this.noise = [];

			this.setFactors();

			this.prebind = {
				update: this.update.bind(this)
			};

			this.clock = null;
			this.material = null;
			window.spiky = this;
		}
		SpikySahder.prototype = {
			consturctor: SpikySahder,
			ctr: new CustomControl(),
			setFactors: function(){
				this.select = this.select || {};
				this.select.morphMode = this.select.morphMode || {};
				this.select.morphMode['Honey Ball'] = 'honey';
				this.select.morphMode['Spiky Ball'] = 'spiky';

				//Control Factors
				this.factors = this.factors || {};

				this.factors.speed = 1;
				this.factors.mode = 'honey';
				this.factors.moveWave = true;



				// this.factors.rotateX = true;
				// this.factors.rotateY = true;
				// this.factors.rotateZ = true;

			},
			resetAnimation: function(){
				for(var key in this.uniforms){
					this.uniforms[key].animate = true;
				}
				this.setFactors();
			},
			init: function(param){
				param = param || {};
				//clock
				this.clock = param.clock || new THREE.Clock();

				//shader material
				this.material = new THREE.ShaderMaterial( {
					uniforms : this.uniforms,
					attributes : this.attributes,
					vertexShader : ShaderText.spiky.vs,
					fragmentShader : ShaderText.spiky.fs,
					wireframe: true
				});

			},
			reconfig: function(param){
				param = param || {};
				var uniforms = this.uniforms;

				//assign mesh
				this.mesh = param.mesh || (function(){ throw new Error('Requires Mesh.'); }());
				this.mesh.material = this.material;

				//assign texture, and color
				uniforms.color.value =  param.color || (new THREE.Color( 0xff00ff ));
				uniforms.texture.value = THREE.ImageUtils.loadTexture( param.url || 'textures/disturb.jpg' );
				uniforms.texture.value.wrapS = THREE.RepeatWrapping;
				uniforms.texture.value.wrapT = THREE.RepeatWrapping;

				this.loopThroughVerticies();
			},
			cleanUp: function(){
				this.cleanUpCtr();
			},
			loopThroughVerticies: function(){
				//assgin mesh
				var noise = this.noise,
					displacement = this.attributes.displacement,
					displacements = displacement.value,
					vertices =  this.mesh.geometry.vertices;

				//attribute data
				for (var v = vertices.length - 1; v >= 0; v--) {
					displacements[ v ] = 0;
					noise[ v ] = Math.random() * 5;
				}
				this.attributes.displacement.needsUpdate = true;

			},
			setUpCtr: function(){
				this.ctr.addFolder('SpikySahder');
				this.ctr.folder.add(this.factors, 'mode', this.select.morphMode);

				this.ctr.addCtr({
					type: 'color',
					name: 'Ball Color',
					ctx: this.uniforms.color,
					get: function(){
						return '#'+this.value.getHexString();
					},
					set: function(val){
						// val = val.replace('#','0x');
						this.value.setStyle(val);
					},
					finish: function(){
						console.log('ballcolr');
						// this.value.offsetHSL(0,2,2);
					},
				});

				this.ctr.folder.add(this.factors, 'speed', -3,3).listen();
				this.ctr.addCtr({
					type: 'slider',
					name: 'Amplitude',
					ctx: this.uniforms.amplitude,
					get: function(){
						return this.value;
					},
					set: function( val ){
						this.value = val;
					},
					min: -3.2,
					max: 3.2,
					// step: 0.001
				});

				this.ctr.addCtr({
					type: 'slider',
					name: 'Texture Shift',
					ctx: this.uniforms.textureShift,
					get: function(){
						return this.value;
					},
					set: function( val ){
						this.value = val;
					},
					min: -1.2,
					max: 1.2,
					// step: 0.001
				});

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

				this.ctr.folder.add(this.factors, 'moveWave').listen();

				// this.ctr.folder.add(this.factors, 'rotateX').listen();
				// this.ctr.folder.add(this.factors, 'rotateY').listen();
				// this.ctr.folder.add(this.factors, 'rotateZ').listen();


				this.ctr.folder.add(this, 'resetAnimation');

				if (typeof window.orientation !== 'undefined'){

				}else{
					this.ctr.folder.open();
				}

			},

			cleanUpCtr: function(){
				if (this.ctr){
					this.ctr.removeAll();
				}
			},

			update: function (){
				var factors = this.factors;
				var uniforms = this.uniforms;
				var attributes = this.attributes;
				var clock = this.clock;
				// var mesh = this.mesh;
				var noise = this.noise;

				var time = clock.getElapsedTime() * 20;

				//0~1 * 2.5 amplitude
				// this.ctr.ctrConfig['Amplitude']

				if (uniforms.color.animate){
					uniforms.color.value.offsetHSL( 0.0010, 0, 0 );
				}
				if (uniforms.amplitude.animate){
					uniforms.amplitude.value = 3 * Math.sin( factors.speed * 0.05 * time);
				}

				if (uniforms.textureShift.animate){
					uniforms.textureShift.value = 1 * Math.cos( factors.speed * 0.02 * time);
				}

				if (this.factors.moveWave){
					//loop through displacement
					var displacements = attributes.displacement.value;
					var dv, dLength = displacements.length;
					for (dv = 0; dv < dLength; dv++) {
						displacements[ dv ] = Math.sin( 0.1 * dv + time );


						if (factors.mode === 'spiky'){
							noise[ dv ] += 0.5 * ( 0.5 - Math.random() );
							noise[ dv ] += 0.5 * ( 0.5 - Math.random() );
							noise[ dv ] = THREE.Math.clamp( noise[ dv ], -5, 5 );

							displacements[ dv ] += noise[ dv ];
						}
					}
					attributes.displacement.needsUpdate = true;
				}


				// //rotate the ball.
				// if (this.factors.rotateX){
				// 	this.mesh.rotation.x += factors.speed / 50;
				// }
				// if (this.factors.rotateY){
				// 	this.mesh.rotation.y += factors.speed / 50;
				// }
				// if (this.factors.rotateZ){
				// 	this.mesh.rotation.z += factors.speed / 50;
				// }

				this.ctr.syncController();

			}

		};

		return SpikySahder;
	});
