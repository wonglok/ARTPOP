'use strict';
/* global THREE */
angular.module('artpopApp')
.factory('meshBank', function ($cacheFactory, Banker) {


	function MeshBank(){
		var self = this;
		this.cache = $cacheFactory('meshBank');
		this.makeMeshWithGeometry = function(geometry) {
			geometry.dynamic = true;
			return new THREE.Mesh(geometry);
		};
		this.factories = {
			/*
			{
				radius: 50,
				detail: 0
			}
			*/
			sphereHD: function (param){
				param = param || {};

				param.radius = param.radius || 40;
				param.segments = param.segments || 50;
				param.rings = param.rings || 50;

				return self.factories.sphere(param);
			},
			sphere: function (param){
				param = param || {};
				var radius = param.radius || 40,
				segments = param.segments || 40,
				rings = param.rings || 40;

				var geometry = new THREE.SphereGeometry( radius, segments, rings );
				return self.makeMeshWithGeometry(geometry);
			},
			icosahedronHD: function (param){
				param = param || {};
				var radius = param.radius || 50,
				detail = param.detail || 3;

				var geometry = new THREE.IcosahedronGeometry(radius,detail);

				return self.makeMeshWithGeometry(geometry);
			},
			icosahedron: function (param){
				param = param || {};
				var radius = param.radius || 50,
				detail = param.detail || 0;

				var geometry = new THREE.IcosahedronGeometry(radius,detail);

				return self.makeMeshWithGeometry(geometry);
			},



			ring: function(param){

				// RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
				// innerRadius — Default is 0, but it doesn't work right when innerRadius is set to 0.
				// outerRadius — Default is 50.
				// thetaSegments — Number of segments. A higher number means the ring will be more round. Minimum is 3. Default is 8.
				// phiSegments — Minimum is 3. Default is 8.
				// thetaStart — Starting angle. Default is 0.
				// thetaLength — Central angle. Default is Math.PI * 2.

				param = param || {};

				param.innerRadius = param.innerRadius || 20;
				param.outerRadius = param.outerRadius || 50;
				param.thetaSegments = param.thetaSegments || 20;
				param.phiSegments = param.phiSegments || 20;
				param.thetaStart = param.thetaStart || 0;
				param.thetaLength = param.thetaLength || Math.PI * 2;

				var geometry = new THREE.RingGeometry(
					param.innerRadius,
					param.outerRadius,
					param.thetaSegments,
					param.phiSegments,
					param.thetaStart,
					param.thetaLength
				);

				return self.makeMeshWithGeometry(geometry);
			},

			cube: function (param){
				param = param || {};

				param.width = param.width || 45;
				param.height = param.height || 45;
				param.depth = param.depth || 45;
				param.widthSegments = param.widthSegments || 1;
				param.heightSegments = param.heightSegments || 1;
				param.depthSegments = param.depthSegments || 1;

				var geometry = new THREE.CubeGeometry(
					param.width,
					param.height,
					param.depth,
					param.widthSegments,
					param.heightSegments,
					param.depthSegments
				);

				return self.makeMeshWithGeometry(geometry);
			},

			cubeHD: function (param){
				param = param || {};

				param.width = param.width || 45;
				param.height = param.height || 45;
				param.depth = param.depth || 45;
				param.widthSegments = param.widthSegments || 5;
				param.heightSegments = param.heightSegments || 5;
				param.depthSegments = param.depthSegments || 5;

				return self.factories.cube(param);
			}
		};
	}
	MeshBank.prototype = Object.create(Banker.prototype);


	return new MeshBank();
});























