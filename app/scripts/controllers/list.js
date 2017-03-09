'use strict';

/**
 * @ngdoc function
 * @name bmiCalculatorAngularApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the bmiCalculatorAngularApp
 */
angular.module('bmiCalculatorAngularApp')
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
  .controller(
    'ListCtrl', ['BMIService', 'HelpService', 'orderByFilter', 'limitToFilter', 'timeAgoFilter', 'pageName',
      function(BMIService, HelpService, orderByFilter, limitToFilter, timeAgoFilter, pageName) {
        console.log(pageName);
        var self = this;
        var fetchList = function() {
          return BMIService
            .index()
            .then(function(response) {
              self.list = response.data;
              self.filteredList = self.filterList(self.list);
            }, function(errorResponse) {
              console.log('error while fetching list');
            });
        };
        var saveItem = function(item) {
          return BMIService
            .create(item)
            .then(function() {
              self.model = {};
            }, function(errorResponse) {
              console.log('error while creating item');
            });
        };
        this.filterList = function() {
          return _.map(limitToFilter(orderByFilter(self.list, '-id'), self.currentLimit), function(o) {
            return _.assign({}, o, {timeAgo: timeAgoFilter(o.id)});
          });
        };
        this.getHelpBlock = function(error) {
          return HelpService[self.getErrorType(error)];
        };
        this.showHelpBlock = function(error) {
          return self.getErrorType(error);
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
          saveItem(_.assign({}, {id: new Date().getTime()}, data))
            .then(fetchList);
        };
        this.showMoreItems = function() {
          self.currentLimit = self.currentLimit + self.rows;
          self.filteredList = self.filterList(self.list);
        };
        this.noMoreItems = function() {
          return self.list.length - self.currentLimit <= 0;
        };
        this.list = [];
        this.rows = 2;
        this.currentLimit = this.rows;
        this.formGroups = {
          standard: [
            {
              unit: 'lb',
              placeholder: '175'
            },
            {
              unit: 'ft',
              placeholder: '5'
            },
            {
              unit: 'in',
              placeholder: '8'
            }
          ],
          metric: [
            {
              unit: 'kg',
              placeholder: '79'
            },
            {
              unit: 'cm',
              placeholder: '173'
            }
          ]
        };
        fetchList();
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
  }])
  .directive('numberInput', [function() {
    return {
      templateUrl: 'directives/number-input.html',
      restrict: 'E',
      link: function($scope, element, attrs) {
        $scope.mode = attrs.mode;
        $scope.getHelpBlock = $scope.ctrl.getHelpBlock;
        $scope.showHelpBlock = $scope.ctrl.showHelpBlock;
        $scope.isMode = $scope.ctrl.isMode;
      }
    }
  }]);
