'use strict';
/* global THREE */
angular.module('artpopApp')
.factory('meshBank', function ($cacheFactory, Banker) {


	function MeshBank(){
		this.cache = $cacheFactory('meshBank');
		this.factories = {
			/*
			{
				radius: 50,
				detail: 0
			}
			*/
			twentyFace: function (param){
				param = param || {};
				var radius = param.radius || 50,
				detail = param.detail || 0;

				var geometry = new THREE.IcosahedronGeometry(radius,detail);
				geometry.dynamic = true;
				var mesh = new THREE.Mesh( geometry );
				return mesh;
			},
			/*
				radius: 40,
				segments: 75,
				rings: 75,
			*/
			sphereHD: function (param){
				param = param || {};
				var radius = param.radius || 40,
				segments = param.segments || 75,
				rings = param.rings || 75;

				var geometry = new THREE.SphereGeometry( radius, segments, rings );
				geometry.dynamic = true;
				var mesh = new THREE.Mesh( geometry );
				return mesh;
			},
			sphere: function (param){
				param = param || {};
				var radius = param.radius || 40,
				segments = param.segments || 50,
				rings = param.rings || 50;

				var geometry = new THREE.SphereGeometry( radius, segments, rings );
				geometry.dynamic = true;
				var mesh = new THREE.Mesh( geometry );
				return mesh;
			},

			newObj: function (param){
				param = param || {};

			},

			circle: function(param){
				param = param || {};
				var radius = param.radius || 10;
				var segments = param.segments || 32;

				var geometry = new THREE.CircleGeometry( radius, segments );
				geometry.dynamic = true;
				var mesh = new THREE.Mesh( geometry );

				return mesh;
			},
			lathe: function (){

				var points = [];
				for ( var i = 0; i < 10; i ++ ) {
					points.push( new THREE.Vector3( Math.sin( i * 0.2 ) * 15 + 50, 0, ( i - 5 ) * 2 ) );
				}
				var geometry = new THREE.LatheGeometry( points );
				geometry.dynamic = true;

				var lathe = new THREE.Mesh( geometry );

				return lathe;
			},



		};
	}
	MeshBank.prototype = Object.create(Banker.prototype);

	return new MeshBank();
});























