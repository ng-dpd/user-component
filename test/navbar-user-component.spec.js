describe('NavbarUserComponent', function() {
  var $httpBackend, $compile, $rootScope, dpdUserStore, DpdUser, fakeUser;

  beforeEach(module('navbarUserComponent', 'navbar-user-component.html'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$compile_, _dpdUserStore_, _DpdUser_, _$controller_) {
    dpdUserStore = _dpdUserStore_;
    DpdUser = _DpdUser_;
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


  describe('DpdUser', function () {
    it('should make a request to /users/me when calling get()', function () {
      $httpBackend.expectGET('/users/me').respond(200);
      DpdUser.get({path: 'me'});
      $httpBackend.flush();
    });
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


  describe('NavbarUserComponentCtrl', function () {
    it('should set user in the dpdUserStore service after successfully fetching user',
        function () {
          var controller, setSpy = spyOn(dpdUserStore, 'set');
          $httpBackend.whenGET('/users/me').respond(JSON.stringify(fakeUser));

          controller = $controller('NavbarUserComponentCtrl', $rootScope.$new());
          $httpBackend.flush();

          expect(setSpy).toHaveBeenCalledWith(fakeUser.username, fakeUser.id);
      });


    it('should clear user if not username in response object', function () {
      var controller, setSpy = spyOn(dpdUserStore, 'clear');
      $httpBackend.whenGET('/users/me').respond(204);
      controller = $controller('NavbarUserComponentCtrl', $rootScope.$new());
      $httpBackend.flush();

      expect(setSpy).toHaveBeenCalled();
    });


    it('should clear user if request errors', function () {
      var controller, setSpy = spyOn(dpdUserStore, 'clear');
      $httpBackend.whenGET('/users/me').respond(400);
      controller = $controller('NavbarUserComponentCtrl', $rootScope.$new());
      $httpBackend.flush();

      expect(setSpy).toHaveBeenCalled();
    });


    it('should log out when calling logout()', function () {
      $httpBackend.expectGET('/users/me').respond(200);
      var controller = $controller('NavbarUserComponentCtrl', $rootScope.$new());
      $httpBackend.expectGET('/users/logout').respond(200);
      controller.logout();
      $httpBackend.flush();
    });


    it('should attempt logging in when calling login()', function () {
      var controller, spy = spyOn(dpdUserStore, 'set');
      $httpBackend.expectGET('/users/me').respond(200);
      controller = $controller('NavbarUserComponentCtrl', $rootScope.$new());
      $httpBackend.expectPOST('/users/login').respond('{"uid": "uniqueid"}');

      controller.login('myusername', 'fooey');
      $httpBackend.flush();

      expect(spy).toHaveBeenCalledWith('myusername', 'uniqueid');
    });

    it('should throw when not passed a required argument', function () {

    });
  });


  describe('ngDpdNavbarUserComponent', function () {
    it('should show the username if the user is already logged in', function() {
      $httpBackend.whenGET('/users/me').respond(JSON.stringify(fakeUser));
      var compiled = $compile('<ng-dpd-navbar-user-component></ng-dpd-navbar-user-component>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();

      expect(compiled.text()).toContain('fakeuser');
    });


    it('should show an error message when fetching a user throws an error', function () {
      $httpBackend.whenGET('/users/me').respond(400);
      var compiled = $compile('<ng-dpd-navbar-user-component></ng-dpd-navbar-user-component>')($rootScope);
      $rootScope.$apply();
      $httpBackend.flush();

      //Needs an expectation
    });
  });
});
