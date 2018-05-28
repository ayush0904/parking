angular.module('ParkingCenterConsole')
  .controller('ChangePasswordController', ['$scope', 'UtilityService', '$state', 'HTTPService', '$localStorage', 'Config', 'ConnectivityMonitor',
    function ($scope, UtilityService, $state, HTTPService, $localStorage, Config, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.user = {};
      $scope.changeUserPassword = function () {
        var data = {
          userId: $localStorage.userData[0].userId,
          password: $scope.user.userPassword,
          currentPassword : $scope.user.currentPassword
        };
        UtilityService.showLoader("Changing Password..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "change-password", data).then(function (result) {
          UtilityService.hideLoader();
          $scope.user.userPassword = "";
          $scope.user.password = "";
          $scope.user.currentPassword = "";
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $state.go('main.myAccount');
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      var init = function () {
        checkLoginState();
      };
      init();
    }]);
