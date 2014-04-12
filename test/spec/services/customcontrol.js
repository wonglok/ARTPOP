'use strict';

describe('Service: CustomControl', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var CustomControl;
  beforeEach(inject(function (_CustomControl_) {
    CustomControl = _CustomControl_;
  }));

  it('should do something', function () {
    expect(!!CustomControl).toBe(true);
  });

});
