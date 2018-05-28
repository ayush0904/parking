angular.module("APP_CONSTANTS", [])
  .constant("Config", {

    // "BASE_URL": "http://192.168.1.33:3000/",
    "BASE_URL": "http://192.169.197.217:3000/",

    "USER_ROLES": {
      "SUPERADMIN": 4,
      "ADMIN": 1,
      "PARKMAN": 3,
      "USER": 2
    },
    "PARKING_VEHICALS":{
      "CAR" : 1,
      "BIKE":2,
      "CYCLE":3
    },

    "PARKING_MODES": {
      "CHECK_IN": 1,
      "CHECK_OUT": 2
    },
    "TIME_NOTATION": {
      "DAYS": "D",
      "HOURS": "H",
      "NEXTHOUR": "NH"
    },
    "DAYS":{
      "WEEKDAYS":"WD",
      "WEEKENDS":"WE"
    },
    "IS_BASE_PRICE": 1,
    "IS_NOT_BASE_PRICE": 0,
    "IS_PASS": 1,
    "IS_NOT_PASS": 0,

    "templateUrls": {

      "authentication": {
        "login": "views/authentication/login/login.html",
        "changePassword": "views/authentication/changePassword/change-password.html",
        "forgetPassword": "views/authentication/forgetPassword/forget-password.html",
        "verifyOtp": "views/authentication/verifyOtp/verify-otp.html"
      },

      "common": {
        "footerTabMenu": "views/common/footer-tab-menu.html"
      },

      "tabs": {
        "dashboard": "views/dashboard/dashboard.html",
        "account": "views/account/account.html",
        "settings": "views/settings/settings.html"
      },

      "userProfile": "views/account/profile/profile.html",

      "helpCenter": {
        "helpCenterMenus": "views/settings/helpCenter/help-center.html",
        "helpCenterSubMenus": "views/settings/helpCenter/helpSubMenus/help-submenus.html",
        "helpCenterDescription": "views/settings/helpCenter/helpDescription/help-description.html"
      },

      "contactUs": "views/settings/contactUs/contact-us.html",

      "bookings": {
        "bookingPayment": "views/payment/booking-payment.html",
        "createPasses": "views/booking/passes/createPasses/create-pass.html",
        "viewPasses": "views/booking/passes/viewPasses/view-passes.html",
        "bookingHistory": "views/booking/bookingHistory/booking-history.html",
        "viewQrCode": "views/booking/viewQrCode/view-qr-codes.html"
      },
      "center": {
        "addNewParkmen": "views/center/parkmen/add-new-parkmen.html",
        "addGates": "views/center/gates/addGates/add-gates.html",
        "addBookingPrice": "views/center/vehicalPrices/addPrice/add-booking-price.html",
        "viewBookingPrice": "views/center/vehicalPrices/viewPrice/view-price.html",
        "addMonthlyPasses": "views/center/vehicalPrices/addPass/add-pass.html",
        "assignParkmenRole": "views/center/parkmen/assign-role.html",
        "viewParkmen": "views/center/parkmen/viewParkmen/view-parkmen.html",
        "viewCenterGates": "views/center/gates/viewGates/view-gates.html",
      }
    }

  });
