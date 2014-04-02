'use strict';

describe('Directive: activeLink', function () {

  // load the directive's module
  beforeEach(module('artpopApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make element', inject(function ($compile) {
    element = angular.element('<div active-link="active"><a ng-href="#venus"></div>');
    element = $compile(element)(scope);

  }));
});
