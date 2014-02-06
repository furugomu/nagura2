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

// 殴るリンク
app.directive('naguraDojoLink', function() {
  return {
    restrict: 'E',
    template: '<a ng-transclude></a>',
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      var dojo = scope.dojo;
      var innerUrl =
        'http://125.6.169.35/idolmaster/battle/battle_check/'+String(dojo.id);
      var url =
        'http://sp.pf.mbga.jp/12008305/?url=' + encodeURIComponent(innerUrl);
      element.attr('href', url);

      // 別窓で開く
      scope.$watch('openInOtherWindow', function(value) {
        element.attr('target', value ? 'nagura-new-window' : '');
      });

      // クリック回数を増やす
      element.on('click', function(e) {
        scope.$apply(function() {
          if (dojo.count == null) dojo.count = 0;
          dojo.count += 1;
        });
      });
    }
  }
});

// 殴れるのだけ表示
app.filter('countLessThan', function($filter) {
  return function(dojos, n) {
    if (!n) return dojos;
    return $filter('filter')(dojos, function(dojo) {
      return !dojo.count || dojo.count < n;
    });
  }
});
