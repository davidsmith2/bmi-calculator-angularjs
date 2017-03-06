'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('bmiCalculatorAngularApp'));

  var mainCtrl,
    scope,
    mockBMIService;

  beforeEach(module(function($provide) {
    var data = [];
    mockBMIService = {
      index: function() {
        var dfd = $.Deferred();
        dfd.resolve(data);
        return dfd.promise();
      },
      create: function(item) {
        var dfd = $.Deferred();
        data.push(item);
        dfd.resolve('success');
        return dfd.promise();
      },
      show: function(id) {
        var dfd = $.Deferred();
        dfd.resolve(_.find(data, function(o) { o.id === id; }));
        return dfd.promise();
      }
    };
    $provide.value('BMIService', mockBMIService);
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    mainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    mainCtrl.model = {};
  }));

  it('should use the service', inject(function(BMIService) {
    spyOn(BMIService, 'create');
    mainCtrl.saveBMI();
    expect(BMIService.create).toHaveBeenCalled();
  }));

});
