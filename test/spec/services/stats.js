'use strict';

describe('Service: stats', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var stats;
  beforeEach(inject(function (_stats_) {
    stats = _stats_;
  }));

  it('should do something', function () {
    expect(!!stats).toBe(true);
  });

});
