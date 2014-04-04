'use strict';
/* global THREE */
angular.module('artpopApp')
	.factory('ShaderSpiky', function (ShaderText) {
		function SpikySahder(){
			this.noise = [];
			this.attributes = {
				displacement: {
					type: 'f',
					value: []
				}
			};
			this.uniforms = {
				amplitude: {
					type: 'f',
					value: 3.0
				},
				color:     {
					type: 'c',
					value: null
				},
				texture:   {
					type: 't',
					value: null,
				}
			};
			this.clock = null;
			this.material = null;
		}
		/*
			{
				mesh: meshInstance,
				clock: clockInstance,
				url: urlString,
			}
		*/
		SpikySahder.prototype.init = function(param){
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
			for (var v = 0; v < vertices.length; v++) {
				values[ v ] = 0;
				noise[ v ] = Math.random() * 5;
			}

			//uniforms
			uniforms.color.value = param.color || new THREE.Color( 0xff2200 );
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

			//mesh
			this.mesh = mesh;
			//assign material to mesh;
			this.mesh.material = this.material;
		};
		SpikySahder.prototype.reset = function(){
			this.mesh.material = null;
			this.mesh = null;
		};
		SpikySahder.prototype.update = function (){
			var uniforms = this.uniforms;
			var attributes = this.attributes;
			var clock = this.clock;
			var mesh = this.mesh;
			var noise = this.noise;

			var time = clock.getElapsedTime() * 50;

			mesh.rotation.x = 0.01 * time;
			mesh.rotation.y = 0.01 * time;
			mesh.rotation.z = 0.01 * time;

			uniforms.amplitude.value = 2.5 * Math.sin( mesh.rotation.y * 0.125 );
			uniforms.color.value.offsetHSL( 0.0005, 0, 0 );

			//
			for ( var i = 0; i < attributes.displacement.value.length; i ++ ) {
				attributes.displacement.value[ i ] = Math.sin( 0.1 * i + time );
				noise[ i ] += 0.5 * ( 0.5 - Math.random() );
				noise[ i ] = THREE.Math.clamp( noise[ i ], -5, 5 );
				attributes.displacement.value[ i ] += noise[ i ];
			}
			mesh.position.x = Math.sin(noise[ 0 ]) * 5;
			mesh.position.y = Math.sin(noise[ 1 ]) * 5;
			mesh.position.z = Math.sin(noise[ 2 ]) * 5;


			//
			attributes.displacement.needsUpdate = true;

		};

		return SpikySahder;
	});
