'use strict';

// fake data service
module(function($provide) {
  var data = [];
  $provide.service('DataService', function() {
    this.fetchItem = function(id) {
      return _.find(data, function(o) { o.id === id; });
    };
    this.fetchList = function() {
      return data;
    };
    this.saveItem = function(item) {
      data.push(item);
    };
  });
});

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('bmiCalculatorAngularApp'));

  var mainCtrl,
    scope,
    ds;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, DataService) {
    scope = $rootScope.$new();
    ds = DataService;
    mainCtrl = $controller('MainCtrl');
    mainCtrl.model = {};
  }));

  it('should use the service', function() {
    expect(typeof ds.fetchList).toEqual('function');
  });

  xit('should use the service', function() {
    spyOn(ds, 'fetchList');
    spyOn(ds, 'fetchItem');
    expect(ds.fetchList).toHaveBeenCalled();
    expect(ds.fetchItem).toHaveBeenCalled();
  });

});
