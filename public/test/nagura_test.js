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
    it('href=道場を殴る URL', function() {
      scope.dojo = {id: 56497169};
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      var url = 'http://sp.pf.mbga.jp/12008305/?url='+
        'http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattle%2Fbattle_check%2F56497169';
      expect(el.attr('href')).to.equal(url);
    });

    it('クリックしたら回数を増やす', function() {
      scope.dojo = {id: 56497169};
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      expect(scope.dojo.count).to.undefined;
      console.log(el);
      el.triggerHandler('click');
      expect(scope.dojo.count).to.equal(1);
      el.triggerHandler('click');
      expect(scope.dojo.count).to.equal(2);
    });

    it('別窓で開く', function() {
      scope.openInOtherWindow = true;
      scope.dojo = {id: 56497169};
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      expect(el.attr('target')).to.equal('nagura-new-window');
    });

    it('別窓で開かない', function() {
      scope.openInOtherWindow = false;
      scope.dojo = {id: 56497169};
      var el = $compile('<nagura-dojo-link>ほげ</nagura-dojo-link>')(scope);
      expect(el.attr('target')).to.undefined;
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
