'use strict';

describe('Service: MFAnimatedGIF', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var MFAnimatedGIF;
  beforeEach(inject(function (_MFAnimatedGIF_) {
    MFAnimatedGIF = _MFAnimatedGIF_;
  }));

  it('should do something', function () {
    expect(!!MFAnimatedGIF).toBe(true);
  });

});
