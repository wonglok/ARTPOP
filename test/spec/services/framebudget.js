'use strict';

describe('Service: frameBudget', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var frameBudget;
  beforeEach(inject(function (_frameBudget_) {
    frameBudget = _frameBudget_;
  }));

  it('should do something', function () {
    expect(!!frameBudget).toBe(true);
  });

});
