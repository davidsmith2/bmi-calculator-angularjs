'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularApp')
  .factory('CalculationService', ['$http', function($http) {
    return {
      index: function() {
        return $http.get('http://localhost:3000/api/bmi');
      },
      create: function(item) {
        return $http.post('http://localhost:3000/api/bmi', item);
      },
      calculate: function(model) {
        var kg, m;
        if (model.mode === 'standard') {
          kg = Number(model.lb) * 0.45;
          m = ((Number(model.ft) * 12) + Number(model.in)) * 0.025;
        } else if (model.mode === 'metric') {
          kg = Number(model.kg);
          m = Number(model.cm) / 100;
        }
        return (kg / Math.pow(m, 2)).toFixed(1);
      }
    };
  }])
  .factory('HelpService', [function() {
    return {
      success: {
        msg: 'OK',
        className: 'has-success'
      },
      pattern: {
        msg: 'Not a valid number',
        className: 'has-warning'
      },
      required: {
        msg: 'This field is required',
        className: 'has-error'
      }
    };
  }])
  .controller('MainCtrl', ['CalculationService', 'HelpService', function (CalculationService, HelpService) {
    var self = this;
    this.calculateBMI = function() {
      self.bmi = CalculationService.calculate(self.model);
      CalculationService
        .create({id: $.now(), date: new Date(), bmi: self.bmi, mode: self.model.mode})
        .then(fetchData)
        .then(function(response) {
          console.log(response);
          self.model = {};
        });
    };
    this.getHelpBlock = function(error) {
      return HelpService[this.getErrorType(error)];
    };
    this.showHelpBlock = function(error) {
      return this.getErrorType(error);
    };
    this.getErrorType = function(error) {
      var errorType;
      if (error.required) {
        errorType = 'required';
      } else if (error.pattern) {
        errorType = 'pattern';
      } else {
        errorType = 'success';
      }
      return errorType;
    };
    this.isMode = function(mode) {
      return self.model && self.model.mode && self.model.mode === mode;
    };
    var fetchData = function() {
      return CalculationService
        .index()
        .then(function(response) {
          self.calculations = response.data;
        }, function(errorResponse) {
          console.log(errorResponse);
          console.log('error while fetching data');
        });
    };
    fetchData();
  }]);
