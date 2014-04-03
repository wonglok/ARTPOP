'use strict';

describe('Service: doobStat', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var doobStat;
  beforeEach(inject(function (_doobStat_) {
    doobStat = _doobStat_;
  }));

  it('should do something', function () {
    expect(!!doobStat).toBe(true);
  });

});
