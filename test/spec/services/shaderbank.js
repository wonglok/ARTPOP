'use strict';

describe('Service: shaderBank', function () {

  // load the service's module
  beforeEach(module('artpopApp'));

  // instantiate service
  var shaderBank;
  beforeEach(inject(function (_shaderBank_) {
    shaderBank = _shaderBank_;
  }));

  var Banker;
  beforeEach(inject(function (_Banker_) {
    Banker = _Banker_;
  }));

  var $cacheFactory;
  beforeEach(inject(function (_$cacheFactory_) {
    $cacheFactory = _$cacheFactory_;
  }));

  it('should do something', function () {
    expect(!!shaderBank).toBe(true);
  });

  it('should inherit', function () {
    expect(shaderBank instanceof Banker).toBe(true);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('shaderBank')).toBe(shaderBank.cache);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('fakeBank')).not.toBe(shaderBank.cache);
  });

  it('should do int correctly', function () {
    expect($cacheFactory.get('shaderBankaFore')).not.toBe(shaderBank.cache);
  });



});
