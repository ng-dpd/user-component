angular.module('dpdUser', ['ngResource']).
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
  controller('UserComponentCtrl', ['$rootScope', '$http', 'DpdUser', 'dpdUserStore', function($rootScope, $http, DpdUser, dpdUserStore) {
    this.user = dpdUserStore;

    this.onGetMe = function (user) {
      if (user.username) {
        dpdUserStore.set(user.username, user.id);
      }
      else {
        dpdUserStore.clear();
      }
    };

    this.login = function (username, password) {
      $http.post('/users/login', {username: username, password: password}).
        then(function (user) {
          dpdUserStore.set(username, user.data.uid);
          $rootScope.$emit('dpdUser.login', {username: username, id: user.data.uid});
        });
    };

    this.onGetMeError = function () {
      dpdUserStore.clear();
    };

    this.logout = function () {
      $http.get('/users/logout');
      dpdUserStore.clear();
      $rootScope.$emit('dpdUser.logout');
    };

    DpdUser.get({path: 'me'}).$promise.then(this.onGetMe, this.onGetMeError);
  }]).
  directive('dpdUserComponent', function() {
    return {
      restrict: 'E',
      controller: 'UserComponentCtrl',
      controllerAs: 'userComponentCtrl',
      scope: {},
      templateUrl: 'user-component.html'
    };
  });
