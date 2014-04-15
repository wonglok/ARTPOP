'use strict';

describe('Service: BaseShader', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var BaseShader;
  beforeEach(inject(function (_BaseShader_) {
    BaseShader = _BaseShader_;
  }));

  it('should do something', function () {
    expect(!!BaseShader).toBe(true);
  });

});
