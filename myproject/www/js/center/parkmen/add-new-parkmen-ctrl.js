angular.module('ParkingCenterConsole')
  .controller('AddNewParkmenController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService, $ionicModal, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.addUser = {};
      $scope.addParkingMen = function () {
        if ($localStorage.centerAdminInfo[0]) {
          var addedBy = $localStorage.centerAdminInfo[0].userId;
          var city = $localStorage.centerAdminInfo[0].city;
        }
        var data = {
          name: $scope.addUser.name,
          phoneNo: $scope.addUser.phoneNo,
          roleId: Config.USER_ROLES.PARKMAN,
          city: city,
          emailId: $scope.addUser.emailID || "",
          addedBy: addedBy
        };
        UtilityService.showLoader("Saving Parkmen");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "register", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.addUser = {};
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      var init = function () {
        checkLoginState();
      };
      init()

    }]);
