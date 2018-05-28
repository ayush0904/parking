angular.module('ParkingCenterConsole')
  .controller('ViewParkingPricesController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$mdBottomSheet', 'ConnectivityMonitor',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService, $mdBottomSheet, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };
      $scope.fetchParkingPrice = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        UtilityService.showLoader("Loading prices..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-center-prices/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          $scope.centerParkingRegularPrice = [];
          $scope.centerParkingPassPrice = [];
          if (response.data.success) {
            var centerGatesObj = response.data.responseData;
            angular.forEach(centerGatesObj, function (value, key) {
              if (value.isPass)
                $scope.centerParkingPassPrice.push(
                  {
                    "priceId": value.priceId,
                    "centerId": value.centerId,
                    "vehicalId": value.vehicalId,
                    "time": value.time,
                    "time_notation": value.time_notation,
                    "price": value.price,
                    "isBasePrice": value.isBasePrice,
                    "isPass": value.isPass,
                    "isDeleted": value.isDeleted
                  }
                );
              else
                $scope.centerParkingRegularPrice.push(
                  {
                    "priceId": value.priceId,
                    "centerId": value.centerId,
                    "vehicalId": value.vehicalId,
                    "time": value.time,
                    "time_notation": value.time_notation,
                    "price": value.price,
                    "isBasePrice": value.isBasePrice,
                    "isPass": value.isPass,
                    "isWeekendPrice": value.day == "WE" ? true : false,
                    "isDeleted": value.isDeleted
                  }
                )
            });
          } else
            $scope.isPricingAvailable = true;
        });
      };

      $scope.updatePrices = function (priceObj) {
        var data = {
          price: priceObj.amount,
          time: priceObj.time,
          priceId: priceObj.priceId,
        };
        UtilityService.showLoader("Updating..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "update-parking-prices", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            delete $localStorage.editPriceObj;
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $scope.fetchParkingPrice();
          }
          else
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
        });
      };

      var init = function () {
        checkLoginState();
        $scope.isPricingAvailable = false;
        $scope.fetchParkingPrice();
      };

      init();

      $scope.showPriceUpdateSheet = function (priceObj) {
        $localStorage.editPriceObj = priceObj;
        $mdBottomSheet.show({
          templateUrl: 'views/modals/update-parking-prices.html',
          controller: 'ListBottomSheetCtrl'
        }).then(function (priceObj) {
          $scope.updatePrices(priceObj);
        }).catch(function (error) {
        });
      };
    }]).controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet, $localStorage, HTTPService, Config) {

    $scope.updateParkingPrices = function () {
      $mdBottomSheet.hide($scope.priceObj);
    };

    $scope.priceObj = {};

    $scope.fetchCenterParkmens = function () {
      if ($localStorage.editPriceObj) {
        $scope.priceObj.amount = $localStorage.editPriceObj.price;
        $scope.priceObj.time = $localStorage.editPriceObj.time;
        $scope.priceObj.priceId = $localStorage.editPriceObj.priceId;
      }
    };

    var init = function () {
      $scope.fetchCenterParkmens();
    };
    init();
  }
);
