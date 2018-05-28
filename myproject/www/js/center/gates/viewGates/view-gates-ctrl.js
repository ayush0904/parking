angular.module('ParkingCenterConsole')
  .controller('ViewParkingGatesController', ['$scope', '$state', '$localStorage', 'UtilityService','HTTPService','Config',
    function ($scope, $state, $localStorage, UtilityService,HTTPService,Config) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.fetchCenterGates = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        UtilityService.showLoader("Fetching Gates..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parking-gates/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          $scope.centerGatesArray = [];
          if (response.data.success) {
            var centerGatesObj = response.data.responseData;
            angular.forEach(centerGatesObj, function (value, key) {
              $scope.centerGatesArray.push(
                {
                  "gateNo": value.gateNo,
                  "gateName": value.gateName
                }
              )
            });
          } else {
            $scope.isGatesAvailable = false;
          }
        });
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      };

      var init = function () {
        checkLoginState();
        $scope.isGatesAvailable = true;
        $scope.fetchCenterGates();
      };
      init();

    }]);
