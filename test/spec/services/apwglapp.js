'use strict';

describe('Service: APWGLAPP', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var APWGLAPP;
  beforeEach(inject(function (_APWGLAPP_) {
    APWGLAPP = _APWGLAPP_;
  }));

  it('should do something', function () {
    expect(!!APWGLAPP).toBe(true);
  });

});
