'use strict';

describe('Service: ShaderBank', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ShaderBank;
  beforeEach(inject(function (_ShaderBank_) {
    ShaderBank = _ShaderBank_;
  }));

  it('should do something', function () {
    expect(!!ShaderBank).toBe(true);
  });

});
