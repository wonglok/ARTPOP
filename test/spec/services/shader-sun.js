'use strict';

describe('Service: ShaderSun', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ShaderSun;
  beforeEach(inject(function (_ShaderSun_) {
    ShaderSun = _ShaderSun_;
  }));

  it('should do something', function () {
    expect(!!ShaderSun).toBe(true);
  });

});
