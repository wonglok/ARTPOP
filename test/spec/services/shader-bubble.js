'use strict';

describe('Service: ShaderBubble', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ShaderBubble;
  beforeEach(inject(function (_ShaderBubble_) {
    ShaderBubble = _ShaderBubble_;
  }));

  it('should do something', function () {
    expect(!!ShaderBubble).toBe(true);
  });

});
