angular.module('ParkingCenterConsole')
  .controller('AddParkingGatesController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor',
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
      // selected gate No
      $scope.gateObj = {
        gateNo: "1"
      };

      $scope.addParkingGate = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        var data = {
          gateName: $scope.gateObj.name,
          gateNo: $scope.gateObj.gateNo,
          centerId: centerId
        };
        UtilityService.showLoader("Saving Gate..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-gates", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.gateObj.name = "";
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
      init();

    }]);
