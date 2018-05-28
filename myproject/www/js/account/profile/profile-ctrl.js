angular.module('ParkingCenterConsole')
  .controller('UserProfileController', ['$scope', '$state', '$localStorage', 'UtilityService',
    function ($scope, $state, $localStorage, UtilityService) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.getCheckInUserBookings = function () {
        if (!$localStorage.userData)
          $state.go('login', {}, {reload: true});
        else
          $scope.user = {
            userIcon: "",
            userName: $localStorage.userData[0].name,
            emailID: $localStorage.userData[0].emailId,
            phoneNo: $localStorage.userData[0].phoneNo,
            dateOfRegistration: $localStorage.userData[0].addedOn,
            centerInfo: $localStorage.centerAdminInfo[0],
          };
      };

      var init = function () {
        checkLoginState();
        $scope.getCheckInUserBookings();
      };
      init();
    }]);
