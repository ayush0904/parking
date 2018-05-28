angular
  .module("ParkingCenterConsole")
  .factory("UtilityService", ["$mdDialog", '$localStorage', '$ionicLoading', '$ionicHistory', function ($mdDialog, $localStorage, $ionicLoading, $ionicHistory) {

    return {
      alertBox: function (title, contentText, okButton, outsideClose, ev) {
        $mdDialog.show(
          $mdDialog.alert()
          // .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(outsideClose)
            .title(title)
            .textContent(contentText)
            .ok(okButton)
            .targetEvent(ev)
        );
      },
      showLoader: function (text) {
        $ionicLoading.show({
          template: "<ion-spinner icon='circles'></ion-spinner><br><span class='f-s-10'>" + text + "</span>",
          animation: 'fade-in',
          showDelay: 0
        }).then(function () {
          // console.log("The loading indicator is now displayed");
        });
      },

      hideLoader: function () {
        $ionicLoading.hide().then(function () {
          // console.log("The loading indicator is now hidden");
        });
      },

      goBack: function () {
        $ionicHistory.goBack();
      }

    };
  }]);
