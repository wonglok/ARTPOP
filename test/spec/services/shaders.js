'use strict';

describe('Service: Shaders', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var Shaders;
  beforeEach(inject(function (_shaders_) {
    Shaders = _shaders_;
  }));

  it('should do something', function () {
    expect(!!Shaders).toBe(true);
  });

});
