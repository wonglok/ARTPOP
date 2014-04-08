'use strict';

describe('Service: datGUI', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var datGUI;
  beforeEach(inject(function (_datGUI_) {
    datGUI = _datGUI_;
  }));

  it('should do something', function () {
    expect(!!datGUI).toBe(true);
  });

});
