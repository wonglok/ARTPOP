'use strict';

describe('Service: X3', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var X3;
  beforeEach(inject(function (_X3_) {
    X3 = _X3_;
  }));

  it('should do something', function () {
    expect(!!X3).toBe(true);
  });

});
