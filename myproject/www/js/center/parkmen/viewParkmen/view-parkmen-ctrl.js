angular.module('ParkingCenterConsole')
  .controller('ViewParkmenController', ['$scope', '$state', '$localStorage', 'UtilityService', 'HTTPService', 'Config', '$mdDialog',
    function ($scope, $state, $localStorage, UtilityService, HTTPService, Config, $mdDialog) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.fetchCenterParkmens = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        UtilityService.showLoader("Fetching Parkmens..");
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parkmen/' + centerId).then(function (response) {
          UtilityService.hideLoader();
          $scope.centerParkmensArray = [];
          if (response.data.success) {
            var centerParkmensObj = response.data.responseData;
            angular.forEach(centerParkmensObj, function (value, key) {
              $scope.centerParkmensArray.push(
                {
                  "parkmenId": value.parkmenId,
                  "name": value.name,
                  "userId": value.userId,
                  "phoneNo": value.phoneNo,
                  "emailId": value.emailId,
                  "addedOn": value.addedOn,
                  "isActive": value.isActive == 1 ? true : false
                }
              )
            });
            $scope.isParkmenAvailable = true;
          } else {
            $scope.isParkmenAvailable = false;
          }
        });
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.changeAccountStatus = function (parkmenId, accountStatus) {
        var data = {
          parkmenId: parkmenId,
          status: accountStatus == true ? 1 : 0
        };
        UtilityService.showLoader("Changing status..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "update-parkmen-status", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });
      };

      $scope.deleteParkmen = function (parkmenId) {
        var data = {
          parkmenId: parkmenId
        };
        UtilityService.showLoader("Deleting Parkmen..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "delete-parkmen", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
            $scope.fetchCenterParkmens();
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        });

      };

      $scope.deleteParkmenConfirm = function (ev, parkmenId) {
        var confirm = $mdDialog.confirm()
          .title('Do you want to delete parkmen?')
          .textContent('He might be on work.Still want to delete ?')
          .targetEvent(ev)
          .ok('YES')
          .cancel('NO');

        $mdDialog.show(confirm).then(function () {
          $scope.deleteParkmen(parkmenId);
        }, function () {
        });
      };

      var init = function () {
        checkLoginState();
        $scope.isParkmenAvailable = true;
        $scope.fetchCenterParkmens();
      };
      init();
    }]);
