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
      }
    };
  }])
  .controller('MainCtrl', ['CalculationService', function (CalculationService) {
    this.isValidForm = false;
    this.mode = 'standard';
    this.modes = {};
    this.helpBlocks = {
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
    var self = this;
    var fetchData = function() {
      return CalculationService
        .index()
        .then(function(response) {
          self.calculations = response.data;
        }, function(errorResponse) {
          console.log('error while fetching data');
        });
    };
    fetchData();
    this.calculateBMI = function() {
      var kg, m;
      if (self.mode === 'standard') {
        kg = Number(self.modes.standard.lb) * 0.45;
        m = ((Number(self.modes.standard.ft) * 12) + Number(self.modes.standard.in)) * 0.025;
      } else if (self.mode === 'metric') {
        kg = Number(self.modes.metric.kg);
        m = Number(self.modes.metric.cm) / 100;
      }
      self.bmi = (kg / Math.pow(m, 2)).toFixed(1);
      CalculationService
        .create({id: $.now(), date: new Date(), bmi: self.bmi, mode: self.mode})
        .then(fetchData)
        .then(function(response) {
          console.log(response);
        });
      self.modes[self.mode] = {};
      self.isValidForm = false;
      return self.bmi;
    };
    this.getMeasurements = function() {
      if (self.mode === 'metric') {
        return ['kg', 'cm'];
      }
      return ['lb', 'ft', 'in'];
    };
    this.changeMode = function(mode) {
      self.mode = mode;
    };
    this.getHelpBlock = function(error) {
      return self.helpBlocks[this.getErrorType(error)];
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
    }
  }]);
