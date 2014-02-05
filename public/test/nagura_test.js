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

  describe('naguraDojoHref', function() {
    it('href=道場を殴る URL', function() {
      scope.dojo = {id: 56497169};
      var el = $compile('<a nagura-dojo-href>ほげ</a>')(scope);
      var url = 'http://sp.pf.mbga.jp/12008305/?url='+
        'http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattle%2Fbattle_check%2F56497169';
      expect(el.attr('href')).to.equal(url);
    });
  });
});
