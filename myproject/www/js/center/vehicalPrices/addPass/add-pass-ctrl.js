angular.module('ParkingCenterConsole')
  .controller('AddParkingPassesController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor',
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

      $scope.passObj = {days: 10};

      if ($localStorage.vehicalTypes)
        $scope.vehicalTypeArray = $localStorage.vehicalTypes;

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.passObj.vehicalType = val.vehicalTypeName;
        })
      };

      $scope.buttonClickable = function () {
        $scope.isVehicalTypeSelected = false;
        $scope.getVehicalTypeName($scope.passObj.vehicalId);
      };

      $scope.addParkingPasses = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;

        var data = {
          vehicalId: $scope.passObj.vehicalId,
          time: $scope.passObj.days,
          time_notation: Config.TIME_NOTATION.DAYS,
          price: $scope.passObj.amount,
          isBasePrice: Config.IS_BASE_PRICE,
          isPass: Config.IS_PASS,
          centerId: centerId
        };
        UtilityService.showLoader("Saving Pass..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-parking-prices", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.passObj = {};
            $scope.passObj = {days: 10};
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })

      };

      var init = function () {
        checkLoginState();
        $scope.isVehicalTypeSelected = true;
      };
      init();


    }]);
