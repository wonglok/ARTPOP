'use strict';

describe('Service: webGLRenderer', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var webGLRenderer;
  beforeEach(inject(function (_webGLRenderer_) {
    webGLRenderer = _webGLRenderer_;
  }));

  it('should do something', function () {
    expect(!!webGLRenderer).toBe(true);
  });

});
