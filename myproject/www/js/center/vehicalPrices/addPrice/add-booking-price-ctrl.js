angular.module('ParkingCenterConsole')
  .controller('AddParkingPricesController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor',
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

      $scope.bookingPriceObj = {baseHour: 1, afterBaseHour: 1};
      $scope.bookingPriceObjForWeekends = {baseHour: 1, afterBaseHour: 1};
      if ($localStorage.vehicalTypes)
        $scope.vehicalTypeArray = $localStorage.vehicalTypes;

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.bookingPriceObj.vehicalType = val.vehicalTypeName;
        })
      };

      $scope.buttonClickable = function () {
        $scope.isVehicalTypeSelected = false;
        $scope.getVehicalTypeName($scope.bookingPriceObj.vehicalId);
      };

      $scope.addHourBasisPrices = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;

        var data = {
          vehicalId: $scope.bookingPriceObj.vehicalId,
          time: $scope.bookingPriceObj.baseHour,
          time_notation: Config.TIME_NOTATION.HOURS,
          price: $scope.bookingPriceObj.baseAmount,
          isBasePrice: Config.IS_BASE_PRICE,
          isPass: Config.IS_NOT_PASS,
          centerId: centerId,
          days: Config.DAYS.WEEKDAYS
        };
        UtilityService.showLoader("Saving Prices..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-parking-prices", data).then(function (result) {
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.addAfterBasePrice(centerId);
          }
          else {
            UtilityService.hideLoader();
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.addAfterBasePrice = function (centerId) {
        try {
          var data = {
            vehicalId: $scope.bookingPriceObj.vehicalId,
            time: $scope.bookingPriceObj.afterBaseHour,
            time_notation: Config.TIME_NOTATION.NEXTHOUR,
            price: $scope.bookingPriceObj.afterBaseAmount,
            isBasePrice: Config.IS_NOT_BASE_PRICE,
            isPass: Config.IS_NOT_PASS,
            centerId: centerId,
            days: Config.DAYS.WEEKDAYS
          };
        } catch (e) {
          UtilityService.hideLoader();
        }
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-parking-prices", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.addHourBasisPricesForWeekends();
            // UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.addHourBasisPricesForWeekends = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;

        var data = {
          vehicalId: $scope.bookingPriceObj.vehicalId,
          time: $scope.bookingPriceObjForWeekends.baseHour,
          time_notation: Config.TIME_NOTATION.HOURS,
          price: $scope.bookingPriceObjForWeekends.baseAmount,
          isBasePrice: Config.IS_BASE_PRICE,
          isPass: Config.IS_NOT_PASS,
          centerId: centerId,
          days: Config.DAYS.WEEKENDS
        };
        UtilityService.showLoader("Saving Prices..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-parking-prices", data).then(function (result) {
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.addAfterBasePriceWeekends(centerId);
          }
          else {
            UtilityService.hideLoader();
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.addAfterBasePriceWeekends = function (centerId) {
        try {
          var data = {
            vehicalId: $scope.bookingPriceObj.vehicalId,
            time: $scope.bookingPriceObjForWeekends.afterBaseHour,
            time_notation: Config.TIME_NOTATION.NEXTHOUR,
            price: $scope.bookingPriceObjForWeekends.afterBaseAmount,
            isBasePrice: Config.IS_NOT_BASE_PRICE,
            isPass: Config.IS_NOT_PASS,
            centerId: centerId,
            days: Config.DAYS.WEEKENDS
          };
        } catch (e) {
          UtilityService.hideLoader();
        }
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "add-parking-prices", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.bookingPriceObj = {};
            $scope.bookingPriceObjForWeekends = {};
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
