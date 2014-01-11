angular.module('navbarUserComponent', ['ngResource']).
  factory('DpdUser', ['$resource', function($resource) {
    return $resource('/users/:path');
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

    this.logout = function () {
      DpdUser.get({path: 'logout'});
    }

    DpdUser.get({path: 'me'}).$promise.then(this.onGetMe, this.onGetMeError);
  }]).
  directive('ngDpdNavbarUserComponent', function() {
    return {
      restrict: 'E',
      controller: 'NavbarUserComponentCtrl',
      controllerAs: 'userComponentCtrl',
      scope: {},
      templateUrl: 'navbar-user-component.html'
    };
  });
