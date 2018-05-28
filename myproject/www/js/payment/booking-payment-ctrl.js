angular.module('ParkingCenterConsole')
  .controller('BookingPaymentController', ['$scope', '$state', 'Config', 'HTTPService', '$localStorage', 'UtilityService', '$window', '$mdBottomSheet',
    function ($scope, $state, Config, HTTPService, $localStorage, UtilityService, $window, $mdBottomSheet) {

      $scope.goBack = function () {
        UtilityService.goBack();
      };

      var checkLoginState = function () {
        if (!$localStorage.userData) {
          $state.go('login', {}, {reload: true});
          return;
        }
      };

      $scope.fetchRegularAmount = function () {
        if ($localStorage.centerAdminInfo[0]) {
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        }
        var data = {
          centerId: centerId,
          filterObj: JSON.stringify($scope.filterObj)
        };
        UtilityService.showLoader("Loading amount..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-amount-collected", data).then(function (result) {
            UtilityService.hideLoader();
            let data = JSON.parse(JSON.stringify(result));
            $scope.bookingAmountDataArray = [];
            $scope.totalAmountCollected = 0;
            if (data.success) {
              var bookingAmountData = data.responseData;
              angular.forEach(bookingAmountData, function (value, key) {
                $scope.totalAmountCollected += value.amountCollected;
                $scope.bookingAmountDataArray.push(
                  {
                    date: value.date,
                    amountCollected: value.amountCollected,
                    totalBookings: value.totalBookings,
                  }
                )
              });
              $scope.showRegularAmountFound = false;
            }
            else {
              $scope.showRegularAmountFound = true;
            }
          }
        )
      };

      $scope.passAmountObj = {};

      $scope.fetchPassAmount = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        var data = {
          centerId: centerId,
          workerId: $scope.passAmountObj.workerId
        };
        UtilityService.showLoader("Loading..");
        HTTPService.executeHttpPostRequest(Config.BASE_URL + "get-pass-amount-collected", data).then(function (result) {
          UtilityService.hideLoader();
          let data = JSON.parse(JSON.stringify(result));
          $scope.passesAmountDataArray = [];
          $scope.totalAmountCollected = 0;
          if (data.success) {
            var passAmountObj = data.responseData;
            angular.forEach(passAmountObj, function (value, key) {
              $scope.totalAmountCollected += value.amountCollected;
              $scope.passesAmountDataArray.push(
                {
                  date: value.date,
                  amountCollected: value.amountCollected,
                  totalPasses: value.totalPasses,
                }
              )
            });
            $scope.showNoPassAmountFound = false;
          }
          else {
            $scope.showNoPassAmountFound = true;
          }
        })
      };

      $scope.fetchCenterParkmens = function () {
        if ($localStorage.centerAdminInfo[0])
          var centerId = $localStorage.centerAdminInfo[0].centerId;
        HTTPService.executeHttpGetRequest(Config.BASE_URL + 'get-parkmen/' + centerId).then(function (response) {
          $scope.centerParkmensArray = [];
          $scope.centerParkmensArray.push({"name": "All", "parkmenId": ""});
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
          }
        });
      };

      var init = function () {
        checkLoginState();
        $scope.isPassScreen = false;
        $scope.showNoPassAmountFound = false;
        $scope.showRegularAmountFound = false;
        $scope.filterObj = {};
        $scope.fetchRegularAmount();
      };
      init();

      $scope.showFiltersSheet = function () {
        $mdBottomSheet.show({
          templateUrl: 'views/modals/check-out-filter.html',
          controller: 'FilterPricesController'
        }).then(function (clickedItem) {
          $scope.filterObj = clickedItem;
          $scope.fetchRegularAmount();
        }).catch(function (error) {
        });
      };

      $scope.Height = $window.innerHeight - 30;

      $scope.slideHasChanged = function ($index) {
        if ($index == 1) {
          $scope.regularTotalAmount = $scope.totalAmountCollected;
          $scope.isPassScreen = true;
          $scope.fetchPassAmount();
          $scope.fetchCenterParkmens();
        }
        else {
          $scope.isPassScreen = false;
          $scope.totalAmountCollected = $scope.regularTotalAmount;
        }
      };

    }])
  .controller('FilterPricesController', function ($scope, $mdBottomSheet, $localStorage, HTTPService, Config) {

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

    $scope.checkOutDates = {};
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
    };
    init();
  });
