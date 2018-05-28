angular.module('ParkingCenterConsole')
  .config(['$stateProvider', '$urlRouterProvider', 'Config', '$ionicConfigProvider', '$cordovaAppRateProvider',
    function ($stateProvider, $urlRouteProvider, Config, $ionicConfigProvider, $cordovaAppRateProvider) {

      $stateProvider.state('main', {
        url: '',
        templateUrl: Config.templateUrls.common.footerTabMenu,
        controller: 'FooterTabMenuController',
        abstract: true
      })
        .state('main.dashboard', {
          url: '/dashboard',
          views: {
            "DashboardContent": {
              templateUrl: Config.templateUrls.tabs.dashboard,
              controller: 'DashboardController'
            }
          }
        })
        .state('main.myAccount', {
          url: '/account',
          views: {
            "accountContent": {
              templateUrl: Config.templateUrls.tabs.account,
              controller: 'MyAccountController'
            }
          }
        })
        .state('main.settings', {
          url: '/settings',
          views: {
            "settingsContent": {
              templateUrl: Config.templateUrls.tabs.settings,
              controller: 'AppSettingsController'
            }
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: Config.templateUrls.authentication.login,
          controller: 'LoginController'
        })
        .state('bookingHistory', {
          url: '/booking-history',
          templateUrl: Config.templateUrls.bookings.bookingHistory,
          controller: 'BookingHistoryController'
        })
        .state('forgetPassword', {
          url: '/forget-password',
          templateUrl: Config.templateUrls.authentication.forgetPassword,
          controller: 'ForgetPasswordController'
        })
        .state('changePassword', {
          url: '/change-password',
          templateUrl: Config.templateUrls.authentication.changePassword,
          controller: 'ChangePasswordController'
        })
        .state('verifyOtp', {
          url: '/verify-otp',
          templateUrl: Config.templateUrls.authentication.verifyOtp,
          controller: 'VerifyOtpController'
        })
        .state('resetNewPassword', {
          url: '/reset-password',
          templateUrl: Config.templateUrls.authentication.changePassword,
          controller: 'ResetPasswordController'
        })
        .state('viewQrCode', {
          url: '/view-qr-code',
          templateUrl: Config.templateUrls.bookings.viewQrCode,
          controller: 'ViewQrCodeController'
        })
        .state('bookingPayment', {
          url: '/booking-payment',
          templateUrl: Config.templateUrls.bookings.bookingPayment,
          controller: 'BookingPaymentController'
        })

        .state('userProfile', {
          url: '/profile',
          templateUrl: Config.templateUrls.userProfile,
          controller: 'UserProfileController'
        })

        //contact us page
        .state('contactUs', {
          url: '/contact-us',
          templateUrl: Config.templateUrls.contactUs,
          controller: 'ContactUsController'
        })

        .state('createPasses', {
          url: '/create-pass',
          templateUrl: Config.templateUrls.bookings.createPasses,
          controller: 'CreatePassController'
        })
        .state('viewPasses', {
          url: '/view-pass',
          templateUrl: Config.templateUrls.bookings.viewPasses,
          controller: 'ViewPassController'
        })


        .state('addParkmen', {
          url: '/add-new-parkmen',
          templateUrl: Config.templateUrls.center.addNewParkmen,
          controller: 'AddNewParkmenController'
        })
        .state('viewParkmen', {
          url: '/view-parkmen',
          templateUrl: Config.templateUrls.center.viewParkmen,
          controller: 'ViewParkmenController'
        })
        .state('assignParkmenRole', {
          url: '/assign-parkmen-role',
          templateUrl: Config.templateUrls.center.assignParkmenRole,
          controller: 'AssignParkmenRoleController'
        })
        .state('addParkingGates', {
          url: '/add-parking-gates',
          templateUrl: Config.templateUrls.center.addGates,
          controller: 'AddParkingGatesController'
        })
        .state('viewParkingGates', {
          url: '/view-parking-gates',
          templateUrl: Config.templateUrls.center.viewCenterGates,
          controller: 'ViewParkingGatesController'
        })
        .state('addParkingPrices', {
          url: '/add-parking-price',
          templateUrl: Config.templateUrls.center.addBookingPrice,
          controller: 'AddParkingPricesController'
        })
        .state('viewParkingPrices', {
          url: '/view-parking-price',
          templateUrl: Config.templateUrls.center.viewBookingPrice,
          controller: 'ViewParkingPricesController'
        })
        .state('addPasses', {
          url: '/add-parking-passes',
          templateUrl: Config.templateUrls.center.addMonthlyPasses,
          controller: 'AddParkingPassesController'
        });


      $urlRouteProvider.otherwise('/login');

      // To set the position of tabs to bottom which default to top for android
      $ionicConfigProvider.tabs.position('bottom');

      // To remove the strip from selected tab on android
      $ionicConfigProvider.tabs.style('standard');

      $ionicConfigProvider.views.maxCache(0);

      //configure default prefrence for app rating
      document.addEventListener("deviceready", function () {
        var prefs = {
          language: 'en',
          appName: 'Parking Center App',
          androidURL: 'market://details?id=com.kas.group.voilabazar'
        };
        $cordovaAppRateProvider.setPreferences(prefs);
      }, false);
    }]);
