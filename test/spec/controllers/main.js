'use strict';

// fake data service
module(function($provide) {
  var data = [];
  $provide.service('BMIService', function() {
    this.show = function(id) {
      var dfd = $.Deferred();
      dfd.resolve(_.find(data, function(o) { o.id === id; }));
      return dfd.promise();
    };
    this.create = function(item) {
      var dfd = $.Deferred();
      data.push(item);
      dfd.resolve('resource created');
      return dfd.promise();
    };
    this.index = function() {
      var dfd = $.Deferred();
      dfd.resolve(data);
      return dfd.promise();
    };
  });
});

describe('Controller: MainCtrl', function () {

  var mainCtrl, bmiService;

  // load the controller's module
  beforeEach(module('bmiCalculatorAngularApp'));

  // Initialize the controller
  beforeEach(inject(function ($controller, BMIService) {
    mainCtrl = $controller('MainCtrl');
    bmiService = BMIService;
  }));

  it('should save item on submit', function() {
    var fakeCall = function() {
      var dfd = $.Deferred();
      dfd.resolve('fake call');
      return dfd.promise();
    };
    spyOn(mainCtrl, 'saveItem').and.callFake(fakeCall);
    mainCtrl.saveBMI({});
    expect(mainCtrl.saveItem).toHaveBeenCalled();
  });

  xit('should fetch list and fetch item on load', function() {
    var fakeCall = function() {
      var dfd = $.Deferred();
      dfd.resolve('fake call');
      return dfd.promise();
    };
    spyOn(mainCtrl, 'fetchList');
    spyOn(mainCtrl, 'fetchItem');
    expect(mainCtrl.fetchList).toHaveBeenCalled();
    expect(mainCtrl.fetchItem).toHaveBeenCalled();
  });

  xit('should have a getHelpBlock function', function() {
    expect(typeof mainCtrl.getHelpBlock).toEqual('function');
  });

  xit('should use the BMI service', function() {
    expect(typeof bmiService.index).toEqual('function');
    expect(typeof bmiService.create).toEqual('function');
    expect(typeof bmiService.show).toEqual('function');
  });

});
