'use strict';

describe('Service: Shaders', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var Shaders;
  beforeEach(inject(function (_Shaders_) {
    Shaders = _Shaders_;
  }));

  it('should do something', function () {
    expect(!!Shaders).toBe(true);
  });

});
