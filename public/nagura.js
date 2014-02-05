"use strict";

function NaguraCtrl($scope, $http) {
  $http.get('/dojos.json')
  .success(function(data) {
    $scope.dojos = data;
  })
  .error(function(data, status, headers, config) {
    alert('どうにもこれはだめです。 '+data);
  });
}
