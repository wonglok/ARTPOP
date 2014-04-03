'use strict';

describe('Controller: ArtpopCtrl', function () {

  // load the controller's module
  beforeEach(module('artpopApp'));

  var ArtpopCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArtpopCtrl = $controller('ArtpopCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);

    //

  });
});
