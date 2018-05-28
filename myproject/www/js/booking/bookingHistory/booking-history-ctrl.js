angular.module('ParkingCenterConsole')
  .controller('BookingHistoryController', ['$scope', 'Config', '$state', 'HTTPService', '$localStorage', 'UtilityService', '$mdDialog', '$ionicSlideBoxDelegate', '$window', '$mdBottomSheet',
    function ($scope, Config, $state, HTTPService, $localStorage, UtilityService, $mdDialog, $ionicSlideBoxDelegate, $window, $mdBottomSheet) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.fetchCheckInVehicals = function () {
        try {
          if ($localStorage.centerAdminInfo[0]) {
            var centerId = $localStorage.centerAdminInfo[0].centerId;
          }
          var data = {
            centerId: centerId
          };
        } catch (e) {
          UtilityService.alertBox("", e.message, "OK", false);
          return;
        }
        UtilityService.showLoader("Fetching bookings..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-current-checked-in", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.allCurrentCheckInDataArray = [];
            var checkInData = data.responseData;
            angular.forEach(checkInData, function (value, key) {
              $scope.allCurrentCheckInDataArray.push(
                {
                  bookingId: value.bookingId,
                  vehicalTypeId: value.vehicalType,
                  checkInBy: value.checkedInBy,
                  checkInGateName: value.checkInGateName,
                  gateNo: value.checkInGateNo,
                  checkInDateTime: parseInt(value.checkInDateTime),
                  userPhoneNo: value.phoneNo,
                  userId: value.userId,
                  vehicalNo: value.vehicalNumber
                }
              )
            });
          }
          else {
            $scope.noCheckInVehicals = true;
          }
        });
      };

      $scope.confirmUserCheckInDelete = function (ev, bookingID) {
        var confirm = $mdDialog.confirm()
          .title('Delete User Check In?')
          .textContent('If you delete Check In ,No check Out can be done.')
          .ariaLabel('delete pass')
          .targetEvent(ev)
          .ok('DELETE')
          .cancel('CANCEL');
        $mdDialog.show(confirm).then(function () {
          deleteUserCheckIn(bookingID);
        }, function () {
          //do nothing
        });
      };

      var deleteUserCheckIn = function (bookingId) {
        var data = {
          bookingId: bookingId
        };
        UtilityService.showLoader("Deleting Check In..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "delete-user-checkin", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.fetchCheckInVehicals();
          }
          else {
            UtilityService.alertBox("", data.message[0].msg, "OK", false);
          }
        })
      };

      $scope.fetchCheckOutVehicals = function () {
        if ($localStorage.centerAdminInfo[0]) {
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        }

        var data = {
          centerId: centerId,
          filterObj: JSON.stringify($scope.filterObj)
        };
        UtilityService.showLoader("Fetching Bookings..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-all-bookings", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          if (data.success) {
            $scope.allCheckOutDataArray = [];
            var checkInData = data.responseData.response;
            $scope.totalCheckOutCount = data.responseData.totalCount;
            angular.forEach(checkInData, function (value, key) {
              $scope.allCheckOutDataArray.push(
                {
                  bookingId: value.bookingId,
                  vehicalTypeId: value.vehicalType,
                  checkInBy: value.checkedInBy,
                  checkOutBy: value.checkOutBy,
                  checkInDateTime: value.checkInDateTime,
                  checkOutDateTime: value.checkOutDateTime,
                  userPhoneNo: value.phoneNo,
                  userId: value.userId,
                  vehicalNo: value.vehicalNumber,
                  discount: value.discount,
                  bookingAmount: value.bookingAmount,
                  isAmountByCash: value.isAmountByCash,
                  passId: value.passId,
                }
              )
            });
            $scope.noCheckOutVehicals = false;
          }
          else {
            $scope.noCheckOutVehicals = true;
          }
        });
      };

      var init = function () {
        checkLoginState();
        $scope.noCheckOutVehicals = false;
        $scope.noCheckInVehicals = false;
        $scope.isCheckOutScreen = false;
        $scope.filterObj = {};
        $scope.fetchCheckInVehicals();
      };

      init();

      $scope.Height = $window.innerHeight - 30;

      $scope.showFiltersSheet = function () {
        $mdBottomSheet.show({
          templateUrl: 'views/modals/check-out-filter.html',
          controller: 'FilterCheckOutController'
        }).then(function (clickedItem) {
          $scope.filterObj = clickedItem;
          $scope.fetchCheckOutVehicals();
        }).catch(function (error) {
        });
      };

      $scope.slideHasChanged = function ($index) {
        if ($index == 1) {
          $scope.isCheckOutScreen = true;
          $scope.fetchCheckOutVehicals();
        }
        else
          $scope.isCheckOutScreen = false;
      };

    }])
  .controller('FilterCheckOutController', function ($scope, $mdBottomSheet, $localStorage, HTTPService, Config) {

    $scope.sortingObj = [
      {
        name: "Date Newest First",
        code: 2
      },
      {
        name: "Date Oldest First",
        code: 1
      }
    ];

    $scope.checkOutDates = {}
    $scope.checkOutFilter = {};

    var changeDateFormatToEpoch = function (date) {
      var newDate = new Date(date);
      return (new Date(newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate()).getTime())
    };
    var getEndDateInEpoch = function (days, date) {
      var newDate = new Date(date);
      return newDate.setDate(newDate.getDate() + parseInt(days));
    };

    $scope.applyCheckOutFilters = function () {
      if (!$scope.checkOutDates.sDate && !$scope.checkOutDates.eDate && !$scope.checkOutFilter.workerId && !$scope.checkOutFilter.sort)
        return;
      if ($scope.checkOutDates.sDate && !$scope.checkOutDates.eDate) {
        $scope.showEndDateError = true;
        return
      }
      $scope.checkOutFilter.startDate = changeDateFormatToEpoch($scope.checkOutDates.sDate);
      $scope.checkOutFilter.endDate = getEndDateInEpoch(1, $scope.checkOutDates.eDate);
      if ($scope.checkOutFilter.endDate <= $scope.checkOutFilter.startDate) {
        $scope.showStartDateGreaterError = true;
        return
      }
      $mdBottomSheet.hide($scope.checkOutFilter);
    };

    $scope.fetchCenterParkmens = function () {
      if ($localStorage.centerAdminInfo[0])
        var centerId = $localStorage.centerAdminInfo[0].centerId;
      HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parkmen/' + centerId).then(function (response) {
        $scope.centerParkmensArray = [];
        if (response.data.success) {
          var centerParkmensObj = response.data.responseData;
          angular.forEach(centerParkmensObj, function (value, key) {
            $scope.centerParkmensArray.push(
              {
                "name": value.name,
                "parkmenId": value.parkmenId
              }
            )
          });
        } else {
          $scope.isParkmenAvailable = false;
        }
      });
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    var init = function () {
      $scope.fetchCenterParkmens();
    }
    init();
  });



