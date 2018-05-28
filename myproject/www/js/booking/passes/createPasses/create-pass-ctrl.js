angular.module('ParkingCenterConsole')
  .controller('CreatePassController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService','ConnectivityMonitor',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService,ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.userPass = {startDate: new Date()};

      $scope.fetchCenterMonthlyPasses = function () {
        if ($localStorage.centerInfo)
          var centerId = $localStorage.centerInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parking-pass/' + centerId + "/" + $scope.userPass.vehicalId).then(function (response) {
          $scope.monthlyPassesArray = [];
          if (response.data.success) {
            var monthlyPassesObj = response.data.responseData;
            angular.forEach(monthlyPassesObj, function (value, key) {
              $scope.monthlyPassesArray.push(
                {
                  "priceId": value.priceId,
                  "centerId": value.centerId,
                  "vehicalId": value.vehicalId,
                  "time": value.time,
                  "time_notation": value.time_notation,
                  "price": value.price,
                  "priceText": value.priceText
                }
              )
            });
          } else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      var getPassDaysFromPriceId = function (priceId) {
        var days = '';
        angular.forEach($scope.monthlyPassesArray, function (value, key) {
          if (parseInt(priceId) == parseInt(value.priceId))
            days = value.time;
        });
        return days;
      };

      $scope.addUserPass = function () {
        var days = getPassDaysFromPriceId($scope.userPass.priceId);
        var startDateInEpoch = changeDateFormatToEpoch($scope.userPass.startDate);
        var endDateInEpoch = getEndDateInEpoch(days, $scope.userPass.startDate);
        if ($localStorage.centerInfo) {
          var centerId = $localStorage.centerInfo[0].centerId;
          var workerId = $localStorage.centerInfo[0].parkingWorkerId;
        }

        var data = {
          vehicalType: $scope.userPass.vehicalId,
          centerId: centerId,
          createdBy: workerId,
          startDate: startDateInEpoch,
          pricingId: $scope.userPass.priceId,
          mobileNo: $scope.userPass.mobileNo,
          cityId: 1,
          endDate: endDateInEpoch
        };

        HTTPService.executeHttpPostRequest(Config.BASE_URL + "save-pass", data).then(function (result) {
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.userPass = [];
            $scope.monthlyPassesArray = [];
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      var changeDateFormatToEpoch = function (date) {
        var newDate = new Date(date);
        return (new Date(newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()).getTime())
      };

      var getEndDateInEpoch = function (days, date) {
        var newDate = new Date(date);
        return newDate.setDate(newDate.getDate() + parseInt(days));
      };

      $scope.getVehicalTypeName = function (vehicalId) {
        angular.forEach($scope.vehicalTypeArray, function (val, key) {
          if (vehicalId == val.vehicalTypeId)
            $scope.userPass.vehicalType = val.vehicalTypeName;
        })
      };
      $scope.vehicalTypeArray = $localStorage.vehicalTypes;

      $scope.buttonClickable = function () {
        $scope.getVehicalTypeName($scope.userPass.vehicalId);
        $scope.fetchCenterMonthlyPasses();
      };

      var init = function () {
        checkLoginState();
      };

      init();
    }]);
