angular.module('ParkingCenterConsole')
  .controller('MyAccountController', ['$scope', '$state', '$rootScope', '$cordovaNetwork', '$localStorage', 'ConnectivityMonitor',
    function ($scope, $state, $rootScope, $cordovaNetwork, $localStorage, ConnectivityMonitor) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      $scope.accountMenus = [
        {name: 'Add User', iconName: 'ion-android-add-circle', link: 'addParkmen', section: 1},
        {name: 'Add Gates', iconName: 'ion-ios-navigate', link: 'addParkingGates', section: 1},
        {name: 'Add Pricing', iconName: 'ion-cash', link: 'addParkingPrices', section: 1},
        {name: 'Add Passes Prices', iconName: 'ion-clipboard', link: 'addPasses', section: 1},
        {name: 'Make Parkmen', iconName: 'ion-man', link: 'assignParkmenRole', section: 1},

        {name: 'View QR Codes', iconName: 'ion-qr-scanner', link: 'viewQrCode', section: 2},
        {name: 'Parking history', iconName: 'ion-ios-copy', link: 'bookingHistory', section: 2},
        {name: 'Earnings', iconName: 'ion-social-usd', link: 'bookingPayment', section: 2},
        {name: 'Center Passes', iconName: 'ion-ios-list', link: 'viewPasses', section: 2},
        {name: 'List Parkmen', iconName: 'ion-android-list', link: 'viewParkmen', section: 2},
        {name: 'List Gates', iconName: 'ion-ios-list-outline', link: 'viewParkingGates', section: 2},
        {name: 'Pricing', iconName: 'ion-card', link: 'viewParkingPrices', section: 2},
        {name: 'Change Password', iconName: 'ion-locked', link: 'changePassword', section: 2}
      ];

      $scope.goToPage = function (link) {
        $state.go(link, {}, {reload: true});
      };

      $scope.goToProfilePage = function () {
        $state.go('userProfile', {}, {reload: true});
      };

      $scope.userLogout = function () {
        $localStorage.$reset();
        if (!$localStorage.userData)
          $state.go('login', {}, {reload: true});
        else
          alert("Unable to logout");
      };

      var init = function () {
        if (!$localStorage.userData) {
          $scope.isUserLoggedIn = false;
          $state.go('login', {}, {reload: true});
        }
        else {
          $scope.isUserLoggedIn = true;
          $scope.loggedInUser = {
            name: $localStorage.userData[0].name
          };
        }
      };
      init();

    }]);
