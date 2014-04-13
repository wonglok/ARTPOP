'use strict';

describe('Service: textureBank', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var textureBank;
  beforeEach(inject(function (_textureBank_) {
    textureBank = _textureBank_;
  }));

  it('should do something', function () {
    expect(!!textureBank).toBe(true);
  });

});
