'use strict';

describe('Service: Three', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var Three;
  beforeEach(inject(function (_THREE_) {
    Three = _THREE_;
  }));

  it('Should Reference to Threejs', function () {
    console.log(typeof Three);
    expect(!!Three).toBe(true);
  });

});
