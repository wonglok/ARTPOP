'use strict';
/* global THREE */
describe('Service: sharedRenderer', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var sharedRenderer;
  beforeEach(inject(function (_sharedRenderer_) {
    sharedRenderer = _sharedRenderer_;
  }));

  it('should do something', function () {
    expect(!!sharedRenderer).toBe(true);
  });

  it('should be THREE.WebGLRenderer', function () {
    expect(sharedRenderer instanceof THREE.WebGLRenderer).toBe(true);
  });

});
