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
  .controller('MainCtrl', [function () {
  }])
  .controller(
    'ListCtrl', ['BMIService', 'HelpService', 'orderByFilter', 'limitToFilter', 'timeAgoFilter',
      function(BMIService, HelpService, orderByFilter, limitToFilter, timeAgoFilter) {
        var self = this;
        this.level = 1;
        this.rows = 2;
        this.currentLimit = this.rows;
        this.list = [];
        this.fetchList = function() {
          return BMIService
            .index()
            .then(function(response) {
              self.list = response.data;
              self.filteredList = self.filterList(self.list);
            }, function(errorResponse) {
              console.log('error while fetching list');
            });
        };
        this.saveItem = function(item) {
          return BMIService
            .create(item)
            .then(function() {
              self.model = {};
            }, function(errorResponse) {
              console.log('error while creating item');
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
        this.saveBMI = function(data) {
          self
            .saveItem(_.assign({}, {id: new Date().getTime()}, data))
            .then(self.fetchList);
        };
        this.showMoreItems = function() {
          self.currentLimit = self.currentLimit + self.rows;
          self.filteredList = self.filterList(self.list);
        };
        this.noMoreItems = function() {
          return self.list.length - self.currentLimit <= 0;
        };
        this.filterList = function() {
          return _.map(limitToFilter(orderByFilter(self.list, '-id'), self.currentLimit), function(o) {
            return _.assign({}, o, {timeAgo: timeAgoFilter(o.id)});
          });
        };
        this.fetchList();
  }])
  .controller('DetailCtrl', ['$routeParams', 'BMIService', function($routeParams, BMIService) {
    var self = this;
    this.level = 2;
    this.item = {};
    this.fetchItem = function (id) {
      return BMIService
        .show(id)
        .then(function(response) {
          self.item = response.data;
        }, function(errorResponse) {
          console.log('error while fetching item');
        });
    };
    this.fetchItem($routeParams.id);
  }])
  .filter('timeAgo', [function() {
    var ONE_MINUTE = 1000 * 60;
    var ONE_HOUR = ONE_MINUTE * 60;
    var ONE_DAY = ONE_HOUR * 24;
    var ONE_WEEK = ONE_DAY * 7;
    return function(ts) {
      var now = new Date().getTime();
      var diff = now - ts;
      if (diff < ONE_MINUTE) {
        return 'seconds ago';
      }
      if (diff - ts < ONE_HOUR) {
        return 'minutes ago';
      }
      if (diff - ts < ONE_DAY) {
        return 'hours ago';
      }
      if (diff - ts < ONE_WEEK) {
        return 'days ago';
      }
    };
  }]);
