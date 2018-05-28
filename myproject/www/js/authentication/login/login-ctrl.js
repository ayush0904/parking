angular.module('ParkingCenterConsole')
  .controller('LoginController', ['$scope', '$state', 'HTTPService', 'Config', '$localStorage', 'UtilityService', 'ConnectivityMonitor',
    function ($scope, $state, HTTPService, Config, $localStorage, UtilityService, ConnectivityMonitor) {

      if ($localStorage.userData)
        $state.go('main.dashboard');

      $scope.user = {};

      $scope.login = function () {
        try {
          var data = {
            username: $scope.user.userName,
            password: $scope.user.password,
            roleId: Config.USER_ROLES.ADMIN
          };
        } catch (e) {
          UtilityService.alertBox("", e.message, "OK", false);
          return;
        }
        UtilityService.showLoader("Signing in..");
        HTTPService.executeHttpPostRequestForLogin(Config.BASE_URL + "login", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (!data.success)
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          else {
            $scope.getCenterAdminInfo();
          }
        })
      };

      $scope.getCenterAdminInfo = function () {
        if ($localStorage.userData[0].userId)
          var userID = $localStorage.userData[0].userId;
        else {
          UtilityService.alertBox("", "Some error occured,Relogin to continue", "OK", false);
          $localStorage.$reset();
        }
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-center-admin/' + userID).then(function (response) {
          if (response.data.success) {
            var centerAdminObj = response.data.responseData;
            $localStorage.centerAdminInfo = centerAdminObj;
            $scope.loadVehicalTypes();
            $state.go('main.dashboard');
          } else {
            $localStorage.$reset();
            UtilityService.alertBox("", response.data.message.msg, "OK", false);
          }
        });
      };

      $scope.openForgetPasswordPage = function () {
        $state.go('forgetPassword');
      };

      $scope.loadVehicalTypes = function () {
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-vehicals-types').then(function (response) {
          if (response.data.success) {
            var vehicalTypeObj = response.data.responseData;
            $scope.vehicalTypeArray = [];
            angular.forEach(vehicalTypeObj, function (value, key) {
              $scope.vehicalTypeArray.push(
                {
                  vehicalTypeId: value.vehicalTypeId,
                  vehicalTypeName: value.vehicalTypeName,
                  vehicalTypeCode: value.vehicalTypeCode
                }
              )
            });
            $localStorage.vehicalTypes = $scope.vehicalTypeArray;
          } else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

    }]);
