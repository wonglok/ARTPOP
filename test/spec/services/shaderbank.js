'use strict';

describe('Service: shaderBank', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var shaderBank;
  beforeEach(inject(function (_shaderBank_) {
    shaderBank = _shaderBank_;
  }));

  it('should do something', function () {
    expect(!!shaderBank).toBe(true);
  });

});
