'use strict';

describe('Service: MeshControl', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var MeshControl;
  beforeEach(inject(function (_MeshControl_) {
    MeshControl = _MeshControl_;
  }));

  it('should do something', function () {
    expect(!!MeshControl).toBe(true);
  });

});
