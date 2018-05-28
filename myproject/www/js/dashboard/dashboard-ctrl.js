angular.module('ParkingCenterConsole')
  .controller('DashboardController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor','$ionicPlatform',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService, $ionicModal, ConnectivityMonitor,$ionicPlatform) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.getTodaysCollectionByVehical = function () {
        $scope.carCurrentAmount = {
          vehicaltype: Config.PARKING_VEHICALS.CAR,
          amountCollected: 0
        };
        $scope.bikeCurrentAmount = {
          vehicaltype: Config.PARKING_VEHICALS.BIKE,
          amountCollected: 0
        };
        $scope.cycleCurrentAmount = {
          vehicaltype: Config.PARKING_VEHICALS.CYCLE,
          amountCollected: 0
        };
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-current-day-amount-collected/' + centerId).then(function (response) {
          if (response.data.success) {
            var pricesObj = response.data.responseData;
            for (var index = 0; index < pricesObj.length; index++) {
              if (pricesObj[index].vehicaltype == Config.PARKING_VEHICALS.CAR)
                $scope.carCurrentAmount.amountCollected = pricesObj[index].amountCollected;
              if (pricesObj[index].vehicaltype == Config.PARKING_VEHICALS.BIKE)
                $scope.bikeCurrentAmount.amountCollected = pricesObj[index].amountCollected;
              if (pricesObj[index].vehicaltype == Config.PARKING_VEHICALS.CYCLE)
                $scope.cycleCurrentAmount.amountCollected = pricesObj[index].amountCollected;
            }
          } else {
          }
        });

      };

      $scope.getTodaysCheckInVehicals = function () {
        $scope.carCurrentCheckedIn = {
          vehicaltype: Config.PARKING_VEHICALS.CAR,
          totalVehicals: 0
        };
        $scope.bikeCurrentCheckedIn = {
          vehicaltype: Config.PARKING_VEHICALS.BIKE,
          totalVehicals: 0
        };
        $scope.cycleCurrentCheckedIn = {
          vehicaltype: Config.PARKING_VEHICALS.CYCLE,
          totalVehicals: 0
        };
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-current-day-checkin/' + centerId).then(function (response) {
          if (response.data.success) {
            var checkedInObj = response.data.responseData;
            for (var index = 0; index < checkedInObj.length; index++) {
              if (checkedInObj[index].vehicaltype == Config.PARKING_VEHICALS.CAR)
                $scope.carCurrentCheckedIn.totalVehicals = checkedInObj[index].bookings;
              if (checkedInObj[index].vehicaltype == Config.PARKING_VEHICALS.BIKE)
                $scope.bikeCurrentCheckedIn.totalVehicals = checkedInObj[index].bookings;
              if (checkedInObj[index].vehicaltype == Config.PARKING_VEHICALS.CYCLE)
                $scope.cycleCurrentCheckedIn.totalVehicals = checkedInObj[index].bookings;
            }
          } else {
          }
        });
      };

      $scope.getAllBookingOfCenter = function () {
        if ($localStorage.centerAdminInfo[0]) {
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        }

        var data = {
          centerId: centerId,
          filterObj: JSON.stringify({startDate : 1514803727000,endDate : 1735728527000})
        };
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-all-bookings", data).then(function (result) {
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.allCheckOutDataArray = [];
            $scope.totalBookingsOfCenter = data.responseData.totalCount;
          }
          else
            $scope.totalBookingsOfCenter = "N/A"

        });
      };

      $scope.getCenterTotalCollections = function () {
        if ($localStorage.centerAdminInfo[0]) {
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        }
        var data = {
          centerId: centerId,
          filterObj: {}
        };
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-amount-collected", data).then(function (result) {
            let data = JSON.parse(JSON.stringify(result));
            $scope.totalAmountCollectedLifetime = 0;
            if (data.success) {
              var bookingAmountData = data.responseData;
              angular.forEach(bookingAmountData, function (value, key) {
                $scope.totalAmountCollectedLifetime += value.amountCollected;
              });
            }
          }
        )
      };

      $scope.init = function () {
        ConnectivityMonitor.startWatching();
        checkLoginState();
        $scope.getAllBookingOfCenter();
        $scope.getCenterTotalCollections();
        $scope.getTodaysCollectionByVehical();
        $scope.getTodaysCheckInVehicals();
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.init();

      $ionicPlatform.registerBackButtonAction(function (event) {
        if($state.current.name=="main.dashboard")
          navigator.app.exitApp();
        else
          navigator.app.backHistory();
      }, 100);
    }]);
