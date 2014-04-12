'use strict';

describe('Service: Modernizr', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var Modernizr;
  beforeEach(inject(function (_Modernizr_) {
    Modernizr = _Modernizr_;
  }));

  it('should do something', function () {
    expect(!!Modernizr).toBe(true);
  });

});
