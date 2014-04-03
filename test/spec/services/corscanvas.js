'use strict';

describe('Service: CORSCanvas', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var CORSCanvas;
  beforeEach(inject(function (_CORSCanvas_) {
    CORSCanvas = _CORSCanvas_;
  }));

  it('should do something', function () {
    expect(!!CORSCanvas).toBe(true);
  });

});
