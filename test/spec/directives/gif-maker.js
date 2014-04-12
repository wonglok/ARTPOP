'use strict';

describe('Directive: gifMaker', function () {

  // load the directive's module
  beforeEach(module('artpopApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gif-maker></gif-maker>');
    element = $compile(element)(scope);
    expect(element.length > 0).toBe(true);
  }));
});
