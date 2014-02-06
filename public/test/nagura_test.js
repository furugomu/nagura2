"use strict";

var expect = chai.expect;

describe('controllers', function() {

  beforeEach(module('nagura'));

  describe('NaguraCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/dojos.json')
        .respond([{id: 1, prof: {}}]);

      scope = $rootScope.$new();
      ctrl = $controller('NaguraCtrl', {$scope: scope});
    }));


    it('道場を取ってくる', function() {
      expect(scope.dojos).to.not.exist;
      $httpBackend.flush();

      expect(scope.dojos).to.deep.equal(
        [{id: 1, prof: {}}]);
    });

    describe('変更されるたびに localStorage に保存する', function() {
      beforeEach(function() {
        localStorage.clear();
      });

      it('openInOtherWindow', function() {
        scope.openInOtherWindow = true;
        scope.$digest();
        expect(localStorage.openInOtherWindow).to.equal('true');
      });

      it('filterValue', function() {
        scope.filterValue = 3;
        scope.$digest();
        expect(localStorage.filterValue).to.equal('3');
      });
    });

  });
});

describe('directives', function() {
  var $compile;
  var scope;

  beforeEach(module('nagura'));

  beforeEach(inject(function(_$compile_, $rootScope) {
    $compile = _$compile_;
    scope = $rootScope.$new();
  }));

  describe('naguraDojoLink', function() {
    beforeEach(function() {
      scope.dojo = {id: 56497169};
    });

    it('href=道場を殴る URL', function() {
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      var url = 'http://sp.pf.mbga.jp/12008305/?url='+
        'http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattle%2Fbattle_check%2F56497169';
      expect(el.attr('href')).to.equal(url);
    });

    it('クリックしたら回数を増やす', function() {
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      expect(scope.dojo.count).to.undefined;
      el.triggerHandler('click');
      expect(scope.dojo.count).to.equal(1);
      el.triggerHandler('click');
      expect(scope.dojo.count).to.equal(2);
    });

    it('別窓で開く', function() {
      scope.openInOtherWindow = true;
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      scope.$digest();
      expect(el.attr('target')).to.equal('nagura-new-window');
    });

    it('別窓で開かない', function() {
      scope.openInOtherWindow = false;
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      scope.$digest();
      expect(el.attr('target')).to.equal('');
    });

    it('target が動的に変わる', function() {
      scope.openInOtherWindow = false;
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      expect(el.attr('target')).to.undefined;

      scope.openInOtherWindow = true;
      scope.$digest();
      expect(el.attr('target')).to.equal('nagura-new-window');
    });
  });
});

describe('filters', function() {
  beforeEach(module('nagura'));

  describe('countLessThan', function() {
    var dojos;
    beforeEach(function() {
      dojos = [{count:null},{count:2},{count:3},{count:4},{count:1}];
    });

    it('count < 3 だけ', inject(function(countLessThanFilter) {
      var filtered = countLessThanFilter(dojos, 3);
      expect(filtered).to.deep.equal(
        [{count:null},{count:2},{count:1}]);
    }));

    it('null なら全て', inject(function(countLessThanFilter) {
      var filtered = countLessThanFilter(dojos, null);
      expect(filtered).to.deep.equal(dojos);
    }));
    it('false なら全て', inject(function(countLessThanFilter) {
      var filtered = countLessThanFilter(dojos, false);
      expect(filtered).to.deep.equal(dojos);
    }));
  });
});
