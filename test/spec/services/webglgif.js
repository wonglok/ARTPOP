'use strict';

describe('Service: WebGLGif', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var WebGLGif;
  beforeEach(inject(function (_WebGLGif_) {
    WebGLGif = _WebGLGif_;
  }));

  it('should do something', function () {
    expect(!!WebGLGif).toBe(true);
  });

  it('should have property', function () {
    expect(!!WebGLGif).toBe(true);
  });


});
