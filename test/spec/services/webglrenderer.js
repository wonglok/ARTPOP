'use strict';

describe('Service: WebGLRenderer', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var WebGLRenderer;
  beforeEach(inject(function (_WebGLRenderer_) {
    WebGLRenderer = _WebGLRenderer_;
  }));

  it('should do something', function () {
    expect(!!WebGLRenderer).toBe(true);
  });

});
