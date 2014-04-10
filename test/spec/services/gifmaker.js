'use strict';

describe('Service: gifMaker', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var gifMaker;
  beforeEach(inject(function (_gifMaker_) {
    gifMaker = _gifMaker_;
  }));

  it('should do something', function () {
    expect(!!gifMaker).toBe(true);
  });

  it('should have correcr member', function () {
    expect(!!gifMaker).toBe(true);
  });


});
