'use strict';

describe('Directive: artpop', function () {

  // load the directive's module
  beforeEach(module('artpopApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make canvas element', inject(function ($compile) {
    element = angular.element('<artpop></artpop>');
    element = $compile(element)(scope);
    expect(element.length >= 1).toBe(true);

  }));
});
