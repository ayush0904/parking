angular.module('ParkingCenterConsole')
  .controller('AssignParkmenRoleController', ['$scope', '$ionicLoading', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$ionicModal', 'ConnectivityMonitor',
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

      $scope.parkmenObj = {roleId: 'Parkmen', userId: ""};

      $scope.addParkmen = function () {
        try {
          if ($localStorage.centerAdminInfo[0])
            var centerId = $localStorage.centerAdminInfo[0].centerId;
          var data = {
            centerId: centerId,
            userId: $scope.parkmenObj.userId
          }
        } catch (e) {
          UtilityService.alertBox("", e.message, "OK", false);
          return;
        }
        UtilityService.showLoader("Saving Parkmen..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "make-parkmen", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.loadUserOfRoleParkmen = function () {
        if ($localStorage.userData[0])
          var addedBy = $localStorage.userData[0].userId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-users/' + Config.USER_ROLES.PARKMAN + '/' + addedBy).then(function (response) {
          if (response.data.success) {
            var usersArray = response.data.responseData;
            $scope.parkmenUsersArray = [];
            angular.forEach(usersArray, function (value, key) {
              $scope.parkmenUsersArray.push(
                {
                  userId: value.userId,
                  name: value.name
                }
              )
            });
          } else {
            UtilityService.alertBox("", response.data.message[0].msg, "OK", false);
          }
        });
      }

      var init = function () {
        checkLoginState();
        $scope.loadUserOfRoleParkmen();
      };
      init();


    }])
;
