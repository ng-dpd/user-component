angular.module('navbarUserComponent', ['ngResource']).
  factory('DpdUser', ['$resource', function($resource) {
    return $resource('/me');
  }]).
  service('dpdUserStore', function () {
    this.set = function (username, id) {
      this.username = username;
      this.id = id;
    };

    this.clear = function () {
      this.username = null;
      this.id = null;
    };
  }).
  controller('NavbarUserComponentCtrl', ['DpdUser', 'dpdUserStore', function(DpdUser, dpdUserStore) {
    var self = this;
    this.user = dpdUserStore;

    this.onGetMe = function (user) {
      if (user.username) {
        dpdUserStore.set(user.username, user.id);
      }
      else {
        dpdUserStore.clear();
      }
    };

    this.onGetMeError = function () {
      dpdUserStore.clear();
    };

    DpdUser.get().$promise.then(this.onGetMe, this.onGetMeError);
  }]).
  directive('ngDpdNavbarUserComponent', function() {
    return {
      restrict: 'E',
      controller: 'NavbarUserComponentCtrl',
      controllerAs: 'userComponentCtrl',
      template: '<div>' +
                  '<div ng-if="userComponentCtrl.user.username">' +
                    '{{userComponentCtrl.user.username}}' +
                  '</div>' +
                  '<div ng-if="!userComponentCtrl.user.username">' +
                    '<form name="loginForm"></form>' +
                  '</div>' +
                '</div>'
    };
  });
