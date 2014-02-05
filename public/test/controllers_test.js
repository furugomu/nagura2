"use strict";

var expect = chai.expect;

describe('controllers', function() {

  beforeEach(function() {
/*
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
*/
  });

  //beforeEach(module('naguraApp'));

  describe('NaguraCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
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
