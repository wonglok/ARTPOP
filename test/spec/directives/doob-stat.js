'use strict';

describe('Directive: doobStat', function () {

  // load the directive's module
  beforeEach(module('artpopApp'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<doob-stat></doob-stat>');
    element = $compile(element)(scope);
    expect(element.length >= 1).toBe(true);
  }));
});
