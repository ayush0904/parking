angular.module('ParkingCenterConsole')
  .controller('AppSettingsController', ['$scope', '$state', '$cordovaAppRate', '$ionicPlatform',
    function ($scope, $state, $cordovaAppRate, $ionicPlatform) {

      $scope.settingsMenu = [
        {name: 'Rate Parking App', link: 'rateApp', icon_text: "ion-ios-star-half", section: 1},
        {name: 'Contact Us', link: 'contactUs', icon_text: "ion-iphone", section: 3},
      ];

      $ionicPlatform.ready(function () {
        $scope.rateApp = function () {
          $cordovaAppRate.promptForRating(true).then(function (result) {
          });
        }
      });

      $scope.openPage = function (link) {
        $state.go(link);
      }
    }]);
