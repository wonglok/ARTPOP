'use strict';
/* global THREE */
angular.module('artpopApp')
	.factory('ShaderSpiky', function (CustomControl, ShaderText) {
		function SpikySahder(){
			this.noise = [];
			this.attributes = {
				displacement: {
					type: 'f',
					value: []
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


			this.factors = {
				mode: 'honey',
				modeOptions: {
					'HoneyComb': 'honey',
					'Spiky': 'spiky'
				},
			};

			this.clock = null;
			this.material = null;
			window.spiky = this;
		}
		SpikySahder.prototype = {
			consturctor: SpikySahder,
			ctr: new CustomControl(),
			init: function(param){
				param = param || {};
				var mesh = param.mesh;
				var noise = this.noise;
				var uniforms = this.uniforms;
				var attributes = this.attributes;
				if (!!!mesh){
					throw new Error('requires mesh.');
				}

				//clock
				this.clock = param.clock || new THREE.Clock();

				//attribute data
				var vertices = mesh.geometry.vertices;
				var values = attributes.displacement.value;
				for (var v = vertices.length - 1; v >= 0; v--) {
					values[ v ] = 0;
					noise[ v ] = Math.random() * 5;
				}

				//uniforms
				uniforms.color.value = param.color || new THREE.Color( 0xff00ff );

				uniforms.texture.value = THREE.ImageUtils.loadTexture( param.url || 'textures/disturb.jpg' );
				uniforms.texture.value.wrapS = THREE.RepeatWrapping;
				uniforms.texture.value.wrapT = THREE.RepeatWrapping;


				//shader material
				this.material = new THREE.ShaderMaterial( {
					uniforms : uniforms,
					attributes : attributes,
					vertexShader : ShaderText.spiky.vs,
					fragmentShader : ShaderText.spiky.fs
				});

				//assgin mesh
				this.mesh = mesh;
				this.mesh.material = this.material;
				this.setUpCtr();
			},
			reconfig: function(param){
				this.mesh = param.mesh;
				this.mesh.material = this.material;
			},
			setUpCtr: function(){
				this.ctr.addFolder('SpikySahder');

				this.ctr.lib.push({
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

				this.ctr.lib.push({
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

				this.ctr.lib.push({
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
				this.ctr.addBatch();

				this.ctr.folder.add(this.factors, 'mode', this.factors.modeOptions).listen();

				this.ctr.folder.add(this, 'resetAnimation');
				this.ctr.folder.open();
			},
			resetAnimation: function(){
				for(var key in this.uniforms){
					this.uniforms[key].animate = true;
				}
			},
			cleanUpCtr: function(){
				this.ctr.ctrRemoveAll();
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

				this.ctr.syncController();

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

				//shake the ball
				// mesh.position.x = Math.sin(noise[ 0 ]) * 2;
				// mesh.position.y = Math.sin(noise[ 1 ]) * 2;
				// mesh.position.z = Math.sin(noise[ 2 ]) * 2;

				attributes.displacement.needsUpdate = true;

			}

		};

		return SpikySahder;
	});
