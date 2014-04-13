'use strict';

describe('Service: MeshFactory', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var MeshFactory;
  beforeEach(inject(function (_MeshFactory_) {
    MeshFactory = _MeshFactory_;
  }));

  it('should do something', function () {
    expect(!!MeshFactory).toBe(true);
  });

});
