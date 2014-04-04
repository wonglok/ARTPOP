'use strict';

describe('Service: ShaderSpiky', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ShaderSpiky;
  beforeEach(inject(function (_ShaderSpiky_) {
    ShaderSpiky = _ShaderSpiky_;
  }));

  it('should do something', function () {
    expect(!!ShaderSpiky).toBe(true);
  });

});
