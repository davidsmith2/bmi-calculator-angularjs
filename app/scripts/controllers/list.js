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
    'ListCtrl', ['BMIService', 'HelpService', 'FormService', 'SocketService', 'orderByFilter', 'limitToFilter', 'timeAgoFilter', 'pageName',
      function(BMIService, HelpService, FormService, SocketService, orderByFilter, limitToFilter, timeAgoFilter, pageName) {
        console.log(pageName);
        var self = this;
        this.filterList = function() {
          return _.map(limitToFilter(orderByFilter(self.list, '-id'), self.currentLimit), function(o) {
            return _.assign({}, o, {timeAgo: timeAgoFilter(o.date)});
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
        this.getList = function() {
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
              self.notify({type: 'create'});
            }, function(errorResponse) {
              console.log('error while creating item');
            });
        };
        this.deleteItem = function(event, id) {
          event.preventDefault();
          return BMIService
            .delete(id)
            .then(function(response) {
              console.log(id + ' deleted');
              self.notify({type: 'delete'});
            }, function(errorResponse) {
              console.log('error while deleting item');
            });
        };
        this.showMoreItems = function() {
          self.currentLimit = self.currentLimit + self.rows;
          self.filteredList = self.filterList(self.list);
        };
        this.noMoreItems = function() {
          return self.list.length - self.currentLimit <= 0;
        };
        this.getContextualClass = function(description) {
          if (description === 'Normal weight') {
            return 'bg-success';
          }
          if (description === 'Obese') {
            return 'bg-danger';
          }
          return 'bg-warning';
        };
        this.notify = function(message) {
          SocketService.emit('message', message);
        };
        this.list = [];
        this.rows = 2;
        this.currentLimit = this.rows;
        this.forms = FormService.getForms();
        this.messages = [];
        SocketService.on('message', function(message) {
          self.messages.push(message);
          self.getList();
        });
        this.notify({type: 'index'});
  }])
  .directive('childForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/childForm.html',
      scope: {
        ctrl: '=',
        parentForm: '=',
        childForm: '='
      },
      link: function(scope) {}
    };
  })
  .directive('childFormInput', [function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/childFormInput.html',
      scope: {
        ctrl: '=',
        field: '=',
        parentForm: '=',
        childFormName: '@'
      },
      link: function(scope) {}
    }
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
