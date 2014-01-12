describe('UserComponent', function() {
  var $httpBackend, $compile, $rootScope, dpdUserStore, fakeUser;

  beforeEach(module('dpdUser', 'user-component.html'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$compile_, _dpdUserStore_, _$controller_) {
    dpdUserStore = _dpdUserStore_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $compile = _$compile_;
    $controller = _$controller_;
    fakeUser = {username: 'fakeuser', id: 'fakeId'};
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  describe('dpdUserStore', function () {
    it('should set username and id to null when calling clear()', function () {
      dpdUserStore.username = 'jeffbcross';
      dpdUserStore.id = 'jeff';
      dpdUserStore.clear();

      expect(dpdUserStore.id).toBe(null);
      expect(dpdUserStore.username).toBe(null);
    });
  });


  describe('UserComponentCtrl', function () {
    it('should set user in the dpdUserStore service after successfully fetching user',
        function () {
          var controller, setSpy = spyOn(dpdUserStore, 'set');
          $httpBackend.whenGET('/users/me').respond(JSON.stringify(fakeUser));

          controller = $controller('UserComponentCtrl', $rootScope.$new());
          $httpBackend.flush();

          expect(setSpy).toHaveBeenCalledWith(fakeUser.username, fakeUser.id);
      });


    it('should clear user if not username in response object', function () {
      var controller, setSpy = spyOn(dpdUserStore, 'clear');
      $httpBackend.whenGET('/users/me').respond(204);
      controller = $controller('UserComponentCtrl', $rootScope.$new());
      $httpBackend.flush();

      expect(setSpy).toHaveBeenCalled();
    });


    it('should clear user if request errors', function () {
      var controller, setSpy = spyOn(dpdUserStore, 'clear');
      $httpBackend.whenGET('/users/me').respond(400);
      controller = $controller('UserComponentCtrl', $rootScope.$new());
      $httpBackend.flush();

      expect(setSpy).toHaveBeenCalled();
    });


    describe('.logout()', function () {
      it('should log out when calling logout()', function () {
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        var controller = $controller('UserComponentCtrl', $rootScope.$new());
        $httpBackend.expectGET('/users/logout').respond(200);
        controller.logout();
        $httpBackend.flush();
      });


      it('should clear dpdUserStore', function () {
        var controller, spy = spyOn(dpdUserStore, 'clear');
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        controller = $controller('UserComponentCtrl', $rootScope.$new());
        $httpBackend.expectGET('/users/logout').respond(200);
        controller.logout();
        $httpBackend.flush();

        expect(spy).toHaveBeenCalled();
      });
    });


    describe('.login()', function () {
      it('should attempt to log in', function () {
        var controller, spy = spyOn(dpdUserStore, 'set');
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        controller = $controller('UserComponentCtrl', $rootScope.$new());
        $httpBackend.expectPOST('/users/login').respond('{"data": {"uid": "uniqueid"}}');

        controller.login('myusername', 'fooey');
        $httpBackend.flush();

        expect(spy).toHaveBeenCalledWith('myusername', 'uniqueid');
      });
    });


    describe('.onLogin()', function () {
      it('should emit a success notification', function () {
        var controller, spy = spyOn(angular, 'noop');
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        controller = $controller('UserComponentCtrl', $rootScope.$new());

        $rootScope.$on('dpdUser.login', angular.noop);
        controller.onLogin('foo', {data: {id: 'bar'}})
        $httpBackend.flush();

        expect(spy).toHaveBeenCalled();
      });


      it('should set loginError to null', function () {
        var controller, spy = spyOn(angular, 'noop');
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        controller = $controller('UserComponentCtrl', $rootScope.$new());

        $httpBackend.whenPOST('/users/login').respond(401);

        controller.login('foobar', 'baz');
        $httpBackend.flush();

        expect(controller.loginError).toBe('Invalid username or password.');
      });


      it('should set loginError to "unknown error" if request errors', function () {
        var controller, spy = spyOn(angular, 'noop');
        $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
        controller = $controller('UserComponentCtrl', $rootScope.$new());

        $httpBackend.whenPOST('/users/login').respond(400);

        controller.login('foobar', 'baz');
        $httpBackend.flush();

        expect(controller.loginError).toBe('Unknown error occurred when attemping to log in.');
      });
    });


    describe('.onLoginError()', function () {
      it('should set loginError to invalid credentials if server responds as such',
        function () {
          var controller;
          $httpBackend.expectGET('/users/me').respond(JSON.stringify(fakeUser));
          controller = $controller('UserComponentCtrl', $rootScope.$new());
          controller.loginError = 'Invalid username or password';

          $rootScope.$on('dpdUser.login', angular.noop);
          controller.onLogin('foo', {data: {id: 'bar'}})
          $httpBackend.flush();
        });
    });
  });


  describe('ngDpdNavbarUserComponent', function () {
    it('should show the username if the user is already logged in', function() {
      $httpBackend.whenGET('/users/me').respond(JSON.stringify(fakeUser));
      var compiled = $compile('<dpd-user-component></dpd-user-component>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();

      expect(compiled.text()).toContain('fakeuser');
    });


    it('should show an error message when fetching a user throws an error', function () {
      $httpBackend.whenGET('/users/me').respond(400);
      var compiled = $compile('<dpd-user-component></dpd-user-component>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();

      //Needs an expectation
    });
  });
});
