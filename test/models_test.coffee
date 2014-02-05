mocha = require 'mocha'
expect = require('chai').expect
sinon = require 'sinon'

models = require '../models'

request = require 'request'

describe 'models', ->
  describe 'dojos', ->
    beforeEach ->
      apiResult = JSON.stringify({dojo:[{id:1, list:{}, prof:{}}]})
      sinon.stub(request, 'get').callsArgWith(1, null, null, apiResult)
      models.apiUrl = 'http://localhost/api/dojo.json'

    afterEach ->
      request.get.restore()
      models.expireCache()

    it 'Array をコールバックに渡す', (done) ->
      models.dojos (err, data) ->
        expect(err).to.be.null
        expect(data).to.be.an('array')
        done()

    it 'sekai.in の API を呼ぶ', ->
      models.dojos(->)
      expect(request.get.called).to.be.ok

    it 'API 呼び出しをキャッシュする', ->
      models.dojos(->)
      models.dojos(->)
      expect(request.get.calledOnce).to.be.ok

    it '時間が経ったらキャッシュが消える', ->
      clock = sinon.useFakeTimers()
      models.dojos(->)
      clock.tick(365*24*60*60*1000) # 1年後
      models.dojos(->)
      clock.restore()
      expect(request.get.calledTwice).to.be.ok
