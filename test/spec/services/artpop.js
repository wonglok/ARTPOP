'use strict';

describe('Service: ARTPOP', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var ARTPOP;
  beforeEach(inject(function (_ARTPOP_) {
    ARTPOP = _ARTPOP_;
  }));

  it('should do something', function () {
    expect(!!ARTPOP).toBe(true);
  });

});
