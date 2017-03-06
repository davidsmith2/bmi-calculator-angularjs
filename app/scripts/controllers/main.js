'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularApp')
  .factory('BMIService', ['$http', function($http) {
    return {
      index: function() {
        return $http.get('http://localhost:3000/api/bmi');
      },
      create: function(data) {
        return $http.post('http://localhost:3000/api/bmi', data);
      },
      show: function(id) {
        return $http.get('http://localhost:3000/api/bmi/' + id);
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
  .controller('MainCtrl', ['HelpService', 'BMIService', function (HelpService, BMIService) {
    var self = this;
    var fetchList = function() {
      return BMIService
        .index()
        .then(function(response) {
          self.list = response.data;
        }, function(errorResponse) {
          console.log('error while fetching list');
        });
    };
    var fetchItem = function (id) {
      return BMIService
        .show(id)
        .then(function(response) {
          self.item = response.data;
        }, function(errorResponse) {
          console.log('error while fetching item');
        });
    };
    var saveItem = function(item) {
      return BMIService
        .create(item)
        .then(function() {
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
    this.saveBMI = function() {
      saveItem(Object.assign({}, {id: $.now().toString(), date: new Date()}, self.model))
        .then(fetchList)
        .then(_.partial(fetchItem, 'latest'));
    };
    fetchList();
    fetchItem('latest');
  }]);
