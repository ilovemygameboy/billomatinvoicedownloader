'use strict';

angular.module('billomatInvoiceDownloader', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'filters',
  'LocalStorageModule',
  'ui.bootstrap'
])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
})
//.config(['localStorageServiceProvider', function(localStorageServiceProvider){
//  localStorageServiceProvider.setPrefix('bs');
//}]);
