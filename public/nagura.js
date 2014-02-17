"use strict";

var app = angular.module('nagura', ['angularLocalStorage']);

function NaguraCtrl($scope, $http, storage, visitCounts) {
  $http.get('/dojos.json')
  .success(function(data) {
    $scope.dojos = data;
  })
  .error(function(data, status, headers, config) {
    alert('どうにもこれはだめです。 '+data);
  });

  storage.bind($scope, 'openInOtherWindow', {defaultValue: true});
  storage.bind($scope, 'filterValue', {defaultValue: '3'});

  visitCounts.bind($scope);
  $scope.reset = function() {
    if (!confirm('リセットする？')) return;
    visitCounts.reset($scope);
  }
}

// 殴った回数を localStorage に保存する
app.factory('visitCounts', function(storage) {
  var key = 'counts';
  var counts;
  // count の初期値を storage からもらう
  var init = function(dojo, scope) {
    var count = counts[dojo.id];
    if (!count) return;
    dojo.count = count;
  }
  // count が変わったら storage にいれる
  var listener = function(dojo) {
    if (!dojo) return;
    if (dojo.count == null) return;
    counts[dojo.id] = dojo.count;
    storage.set(key, counts);
  }
  return {
    // $scope.dojos と storage の count を同期
    bind: function(scope) {
      counts = storage.get(key) || {};
      scope.$watch('dojos', function(dojos) {
        angular.forEach(dojos, function(dojo) {
          init(dojo, scope);
          scope.$watchCollection(
            function() { return dojo },
            listener);
        });
      });
    },
    // リセットする
    reset: function(scope) {
      angular.forEach(scope.dojos, function(dojo) {
        dojo.count = 0;
      });
      storage.remove(key);
    }
  }
});

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
        'http://125.6.169.35/idolmaster/battles/battle_check/'+String(dojo.id);
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
