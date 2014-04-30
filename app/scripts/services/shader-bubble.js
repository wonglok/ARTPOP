'use strict';
/* global THREE, Modernizr */
angular.module('artpopApp')
  .factory('ShaderBubble', function (BaseShader, CustomControl) {
    function ShaderBubble(){
      //Shader Data



      // use "this." to create global object
      this.uniforms = {

        'mRefractionRatio': { type: 'f', value: 1.02 },
        'mFresnelBias': { type: 'f', value: 0.1 },
        'mFresnelPower': { type: 'f', value: 2.0 },
        'mFresnelScale': { type: 'f', value: 1.0 },
        'tCube': { type: 't', value: null }
      };

      this.refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
      this.uniforms.tCube.value = this.refractSphereCamera.renderTarget;


      this.select = {
      };

      this.factors = {};

      this.ctr = null;
      this.clock = null;
      this.material = null;

      this.parent = BaseShader.prototype;

    }
    ShaderBubble.prototype = Object.create(BaseShader.prototype);
    ShaderBubble.prototype.constructor = ShaderBubble;
    ShaderBubble.prototype.init = function(param){
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
        vertexShader : THREE.FresnelShader.vertexShader,
        fragmentShader : THREE.FresnelShader.fragmentShader,
        side: THREE.DoubleSide
      });





      var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/checkerboard.jpg' );
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set( 10, 10 );
      var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
      var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -50.5;
      floor.rotation.x = Math.PI / 2;

      this.floor = floor;



    };

    ShaderBubble.prototype.reconfig = function(param){
      param = param || {};
      // var uniforms = this.uniforms;

      //assign object members
      this.mesh = param.mesh || (function(){ throw new Error('Requires Mesh.'); }());
      this.camera = param.camera || (function(){ throw new Error('Requires Camera.'); }());
      this.scene = param.scene || (function(){ throw new Error('Requires Scene.'); }());
      this.renderer = param.renderer || (function(){ throw new Error('Requires Renderer.'); }());


      this.camera.___lastPosition = this.camera.____lastPosition || {};

      this.camera.___lastPosition.x = this.camera.position.x;
      this.camera.___lastPosition.y = this.camera.position.y;
      this.camera.___lastPosition.z = this.camera.position.z;

      this.camera.position.x = 48;
      this.camera.position.y = 59;
      this.camera.position.z = 47;


      this.scene.add(this.refractSphereCamera);

      this.refractSphereCamera.position = this.mesh.position;

      this.mesh.material = this.material;

      this.scene.add(this.floor);





      // //assgin mesh
      // var noise = this.noise,
      //  displacements = this.attributes.displacement.value,
      //  vertices =  this.mesh.geometry.vertices;

      // //attribute data
      // for (var v = vertices.length - 1; v >= 0; v--) {
      //  displacements[ v ] = 0;
      //  noise[ v ] = Math.random() * 5;
      // }
      // this.attributes.displacement.needsUpdate = true;



    };


    ShaderBubble.prototype.setFactors = function(){
      //Control Factors
      this.factors = this.factors || {};

      // this.factors.timerSpeed = 1;
      // this.factors.mode = 'spiky';
      // this.factors.moveWave = true;

    };
    ShaderBubble.prototype.cleanUp = function(){
      if (this.scene){
        if (this.refractSphereCamera){
          this.scene.remove(this.refractSphereCamera);
        }
        if (this.floor){
          this.scene.remove(this.floor);
        }
      }

      if (this.camera){
        this.camera.position.x = this.camera.___lastPosition.x;
        this.camera.position.y = this.camera.___lastPosition.y;
        this.camera.position.z = this.camera.___lastPosition.z;

        // this.camera.position.x = 0;
        // this.camera.position.y = 0;
        // this.camera.position.z = 0;
      }
      this.parent.cleanUp.call(this);

    };




    ShaderBubble.prototype.setUpCtr = function(){

      this.ctr.addFolder('ShaderBubble');

      // this.ctr.folder.add(this.factors, 'timerSpeed', -3,3).listen();

      // this.ctr.addCtr({
      //   type: 'slider',
      //   name: 'Noise Scale',
      //   ctx: this.uniforms.noiseScale,
      //   get: function(){
      //     return this.value;
      //   },
      //   set: function( val ){
      //     this.value = val;
      //   },
      //   min: 0.1,
      //   max: 3,
      //   // step: 0.001
      // });

      // this.ctr.addCtr({
      //  type: 'slider',
      //  name: 'Texture Shift',
      //  ctx: this.uniforms.textureShift,
      //  get: function(){
      //    return this.value;
      //  },
      //  set: function( val ){
      //    this.value = val;
      //  },
      //  min: -1.2,
      //  max: 1.2,
      //  // step: 0.001
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
    ShaderBubble.prototype.resetAnimation = function(){
      // for(var key in this.uniforms){
      //   this.uniforms[key].animate = true;
      // }
      // this.setFactors();
    };
    ShaderBubble.prototype.update = function (){
      // var factors = this.factors;
      // var uniforms = this.uniforms;
      // var attributes = this.attributes;

      // var mesh = this.mesh;
      // var noise = this.noise;

      // var delta = this.clock.getDelta();

      // this.uniforms.time.value += delta * factors.timerSpeed;

      this.mesh.visible = false;
      this.refractSphereCamera.updateCubeMap( this.renderer, this.scene );
      this.mesh.visible = true;

      this.ctr.syncController();

    };


    return ShaderBubble;
  });
