'use strict';
  app.controller('MainCtrl', function($scope, $http, localStorageService) {
    
    $scope.resource = 'invoices';
    $scope.total = 0;
    $scope.alerts = [];
    $scope.showSpinner = false;
    $scope.result = null;
    $scope.noData = true;
    $scope.invoiceNumbers = [];

    if(localStorageService.get('apikey')) {
      $scope.apikey = localStorageService.get('apikey');
    }
    if(localStorageService.get('billomatid')) {
      $scope.billomatid = localStorageService.get('billomatid');
    }

    $scope.$watch('apikey', function(newVal) {
      localStorageService.add('apikey', newVal);
    });
    $scope.$watch('billomatid', function(newVal) {
      localStorageService.add('billomatid', newVal);  
    });

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.clearStorage = function() {
      console.log("storage cleared");
      localStorageService.clearAll();
      $scope.apikey = null;
      $scope.billomatid = null;
    }

    $scope.makeRequest = function() {
      $scope.showSpinner = true;
      $scope.result = null;
      $scope.alerts = [];
      $http.get('https://'+ $scope.billomatid +'.billomat.net/api/'+ $scope.resource + '?api_key=' + $scope.apikey + '&format=json')
      .success(function(data) {
        $scope.showSpinner = false;
        $scope.result = data;
        angular.forEach($scope.result.invoices.invoice, function(invoice) {
          invoice.downloadlink = 'https://'+ $scope.billomatid +'.billomat.net/portal/files/document/elementId/'+ invoice.id +'/type/invoice/disposition/inline/Rechnung+' + invoice.invoice_number; //Rechnung+RE+130646.pdf
          invoice.billomatlink = 'https://'+ $scope.billomatid +'.billomat.net/portal/invoices/show/entityId/' + invoice.id;
          $scope.invoiceNumbers.push(invoice.invoice_number);
        });
        $scope.invoiceNumbers.sort();
        if($scope.result) {
          $scope.noData = false;
        }
      })
      .error(function(data, status, headers, config) {
        $scope.showSpinner = false;
        $scope.noData = true;
        $scope.alerts.push(
        {   
            type: 'warning',
            msg: '' + data.errors.error
        });
      });
    }
});

// app.filter('mySort', function() {
//     return function(input) {
//       return input.sort();
//     }
//   });

angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });


    // angular.module('yourModule', ['LocalStorageModule'])
    // .controller('yourCtrl', [
    //   '$scope',
    //   'localStorageService',
    //   function($scope, localStorageService) {
    //     // Start fresh
    //     localStorageService.clearAll();
    //     localStorageService.add('Favorite Sport','Ultimate Frisbee');
    // }]);

    
    // To set the prefix of your localStorage name, you can use the setPrefix method 
    // available on the localStorageServiceProvider
    
    // angular.module('yourModule', ['LocalStorageModule'])
    // .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    //   localStorageServiceProvider.setPrefix('newPrefix');
    // }]);