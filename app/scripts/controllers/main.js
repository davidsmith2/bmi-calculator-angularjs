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
  .factory('DataService', ['BMIService', function(BMIService) {
    var fetchList = function() {
      return BMIService
        .index()
        .then(function(response) {
          this.list = response.data;
        }.bind(this), function(errorResponse) {
          console.log('error while fetching list');
        });
    };
    var fetchItem = function (id) {
      return BMIService
        .show(id)
        .then(function(response) {
          this.item = response.data;
        }.bind(this), function(errorResponse) {
          console.log('error while fetching item');
        });
    };
    var saveItem = function(item) {
      BMIService
        .create(item)
        .then(_.bind(fetchItem, this, 'latest'))
        .then(_.bind(fetchList, this))
        .then(function(response) {
          this.model = {};
        }.bind(this));
    };
    return {
      fetchList: fetchList,
      fetchItem: fetchItem,
      saveItem: saveItem
    };
  }])
  .controller('MainCtrl', ['HelpService', 'DataService', function (HelpService, DataService) {
    var self = this;
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
      DataService.saveItem.call(self, Object.assign({}, {id: $.now().toString(), date: new Date()}, self.model));
    };
    DataService.fetchList.call(this);
    DataService.fetchItem.call(this, 'latest');
  }]);
