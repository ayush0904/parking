angular.module('ParkingCenterConsole')
  .controller('ViewPassController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$mdDialog', '$ionicViewService',
    function ($scope, $ionicLoading, Config, $state, HTTPService, $localStorage, UtilityService, $mdDialog, $ionicViewService) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      var deleteUserPass = function (passId) {
        var data = {
          passId: passId
        };
        UtilityService.showLoader("Deleting Pass..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "delete-user-pass", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.fetchUsersPasses();
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.confirmUserPassDelete = function (ev, passId) {
        var confirm = $mdDialog.confirm()
          .title('Delete user pass?')
          .textContent('Once pass is deleted , cannot be recovered')
          .ariaLabel('delete pass')
          .targetEvent(ev)
          .ok('DELETE')
          .cancel('CANCEL');
        $mdDialog.show(confirm).then(function () {
          deleteUserPass(passId);
        }, function () {
          //do nothing
        });
      };

      $scope.fetchUsersPasses = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        UtilityService.showLoader("Fetching Passes..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-user-passes/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          $scope.usersPassesArray = [];
          if (response.data.success) {
            var monthlyPassesObj = response.data.responseData;
            angular.forEach(monthlyPassesObj, function (value, key) {
              $scope.usersPassesArray.push(
                {
                  "passId": value.passId,
                  "vehicalType": value.vehicalType,
                  "centerId": value.centerId,
                  "addedOn": value.addedOn,
                  "startDate": value.startDate,
                  "endDate": value.endDate,
                  "pricingId": value.pricingId,
                  "time": value.time,
                  "time_notation": value.time_notation,
                  "price": value.price,
                  "phoneNo": value.phoneNo,
                  "currentDateTime": value.currentDateTime,
                  "passStatus": value.passStatus,
                  "name":value.name
                }
              )
            });
          } else {
            $scope.isPassFound = false;
          }
        });
        $scope.$broadcast('scroll.refreshComplete');
      };

      var init = function () {
        checkLoginState();
        $scope.isPassFound = true;
        $scope.fetchUsersPasses();
      };

      init();
    }]);
