'use strict';

describe('Service: FrameBudgetPromiseManager', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var FrameBudgetPromiseManager;
  beforeEach(inject(function (_FrameBudgetPromiseManager_) {
    FrameBudgetPromiseManager = _FrameBudgetPromiseManager_;
  }));

  it('should do something', function () {
    expect(!!FrameBudgetPromiseManager).toBe(true);
  });

});
