'use strict';

describe('Service: ShaderText', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ShaderText;
  beforeEach(inject(function (_ShaderText_) {
    ShaderText = _ShaderText_;
  }));

  it('should do something', function () {
    expect(!!ShaderText).toBe(true);
  });

});
