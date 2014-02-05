"use strict";

var app = angular.module('nagura', []);

function NaguraCtrl($scope, $http) {
  $http.get('/dojos.json')
  .success(function(data) {
    $scope.dojos = data;
  })
  .error(function(data, status, headers, config) {
    alert('どうにもこれはだめです。 '+data);
  });
}

// href 属性に殴る URL を入れる
app.directive('naguraDojoHref', function() {
  return function(scope, element, attrs) {
    var dojo = scope.dojo;
    var innerUrl =
      'http://125.6.169.35/idolmaster/battle/battle_check/'+String(dojo.id);
    var url =
      'http://sp.pf.mbga.jp/12008305/?url=' + encodeURIComponent(innerUrl);
    element.attr('href', url);
  }
});
