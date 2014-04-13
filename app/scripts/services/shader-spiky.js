'use strict';
/* global THREE */
angular.module('artpopApp')
	.factory('ShaderSpiky', function (CustomControl, ShaderText) {
		function SpikySahder(){
			//Shader Data
			this.attributes = {
				displacement: {
					type: 'f',
					value: [],
					needsUpdate: true
				}
			};
			this.uniforms = {
				//ctx
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


			//Control Factors
			this.factors = {
				mode: 'honey',
				modeOptions: {
					'HoneyComb': 'honey',
					'Spiky': 'spiky'
				},
				moveWave: true
			};

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
			resetAnimation: function(){
				for(var key in this.uniforms){
					this.uniforms[key].animate = true;
				}
				this.factors.moveWave = true;
				this.material.wireframe = false;
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
					wireframe: false
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
						this.value.offsetHSL(0,1,2);
					},
				});

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

				this.ctr.addBatch();

				this.ctr.folder.add(this.factors, 'mode', this.factors.modeOptions).listen();
				this.ctr.folder.add(this.factors, 'moveWave').listen();

				this.ctr.folder.add(this, 'resetAnimation');
				this.ctr.folder.open();
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
					uniforms.amplitude.value = 3 * Math.sin( 0.05 * time);
				}

				if (uniforms.textureShift.animate){
					uniforms.textureShift.value = 1 * Math.cos( 0.02 * time);
				}

				if (this.factors.moveWave){
					//loop through displacement
					var displacements = attributes.displacement.value;
					var dv, dLength = displacements.length;
					for (dv = 0; dv < dLength; dv++) {
						displacements[ dv ] = Math.sin( 0.1 * dv + time );


						if (factors.mode === 'spiky'){
							// noise[ dv ] += 0.5 * ( 0.5 - Math.random() );
							// noise[ dv ] += 0.5 * ( 0.5 - Math.random() );
							// noise[ dv ] = THREE.Math.clamp( noise[ dv ], -5, 5 );

							displacements[ dv ] += noise[ dv ];
						}
					}
					attributes.displacement.needsUpdate = true;
				}

				//shake the ball
				// mesh.position.x = Math.sin(noise[ 0 ]) * 2;
				// mesh.position.y = Math.sin(noise[ 1 ]) * 2;
				// mesh.position.z = Math.sin(noise[ 2 ]) * 2;



				this.ctr.syncController();

			}

		};

		return SpikySahder;
	});
