"use strict";angular.module("artpopApp").factory("ShaderSun",["BaseShader","CustomControl","ShaderText",function(a,b,c){function d(){var a=new THREE.ImageUtils.loadTexture("textures/cloud.png");a.wrapS=a.wrapT=THREE.RepeatWrapping;var b=new THREE.ImageUtils.loadTexture("textures/lava.jpg");b.wrapS=b.wrapT=THREE.RepeatWrapping,this.uniforms={baseTexture:{type:"t",value:b},baseSpeed:{type:"f",value:.1},noiseTexture:{type:"t",value:a},noiseScale:{type:"f",value:1},alpha:{type:"f",value:.5},time:{type:"f",value:1}},this.select={},this.factors={},this.ctr=null,this.clock=null,this.material=null}return d.prototype=Object.create(a.prototype),d.prototype.constructor=d,d.prototype.init=function(a){a=a||{},this.clock=a.clock||new THREE.Clock,this.ctr=new b,this.setFactors(),this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,vertexShader:c.sun.vs,fragmentShader:c.sun.fs,wireframe:!1}),this.material.side=THREE.DoubleSide},d.prototype.setFactors=function(){this.factors=this.factors||{},this.factors.timerSpeed=1,this.factors.rotateX=!0,this.factors.rotateY=!0,this.factors.rotateZ=!0},d.prototype.reconfig=function(a){a=a||{},this.mesh=a.mesh||function(){throw new Error("Requires Mesh.")}(),this.mesh.material=this.material},d.prototype.setUpCtr=function(){this.ctr.addFolder("SunSahder"),this.ctr.folder.add(this.factors,"timerSpeed",-3,3).listen(),this.ctr.addCtr({type:"slider",name:"Noise Scale",ctx:this.uniforms.noiseScale,get:function(){return this.value},set:function(a){this.value=a},min:.1,max:3}),this.ctr.addCtr({type:"checkbox",name:"wireframe",ctx:this.material,get:function(){return this.wireframe},set:function(a){this.wireframe=a}}),Modernizr.touch||this.ctr.folder.open()},d.prototype.resetAnimation=function(){for(var a in this.uniforms)this.uniforms[a].animate=!0;this.setFactors()},d.prototype.update=function(){var a=this.factors,b=this.clock.getDelta();this.uniforms.time.value+=b*a.timerSpeed,this.ctr.syncController()},d}]),angular.module("artpopApp").factory("BaseShader",function(){function a(){}return a.prototype={init:a,constructor:a,update:function(){},cleanUp:function(){this.cleanUpMesh(),this.cleanUpCtr()},cleanUpMesh:function(){this.mesh&&(this.mesh.material=null,this.mesh=null)},cleanUpCtr:function(){this.ctr&&this.ctr.removeAll()}},a}),angular.module("artpopApp").factory("MeshControl",["CustomControl",function(a){function b(){this.mesh=null,this.factors={},this.ctr=new a}return b.prototype.constructor=b,b.fn=b.prototype,b.prototype.reconfig=function(a){this.mesh=a},b.prototype.resetCtr=function(){this.factors=this.factors||{},this.factors.speed=1,this.factors.rotateX=!1,this.factors.rotateY=!1,this.factors.rotateZ=!0},b.fn.setUpCtr=function(){this.resetCtr(),this.ctr.addFolder("Mesh"),this.ctr.folder.add(this.factors,"speed",-3,3).listen(),this.ctr.folder.add(this.factors,"rotateX").listen(),this.ctr.folder.add(this.factors,"rotateY").listen(),this.ctr.folder.add(this.factors,"rotateZ").listen(),Modernizr.touch||this.ctr.folder.open()},b.fn.cleanUpCtr=function(){this.ctr.removeAll()},b.fn.update=function(){if(this.mesh){var a=this.factors,b=this.mesh;a.rotateX&&(b.rotation.x+=a.speed/50),a.rotateY&&(b.rotation.y+=a.speed/50),a.rotateZ&&(b.rotation.z+=a.speed/50)}},b}]).factory("meshControl",["MeshControl",function(a){return new a}]);