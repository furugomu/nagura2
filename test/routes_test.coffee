mocha = require 'mocha'
expect = require('chai').expect
sinon = require 'sinon'

routes = require '../routes'

express = require 'express'
models = require '../models'

describe 'routes', ->
  req = null
  res = null
  dojos = null
  beforeEach ->
    app = express()
    req = app.request
    res = app.response
    dojos = [{id: '56497169'}, {id: '123456789'}]
    sinon.stub(models, 'dojos').callsArgWith(0, null, dojos)

  afterEach ->
    models.dojos.restore()

  describe 'index', ->
    it 'sendfile する', ->
      mock = sinon.mock(res)
      mock.expects('sendfile').once().withArgs('public/index.html')
      routes.index(req, res)
      mock.verify()

  describe 'dojos.json', ->
    it '配列の JSON を返す', ->
      mock = sinon.mock(res)
      mock.expects('setHeader').withArgs('Content-Type', 'application/json')
      mock.expects('end').once().withArgs(sinon.match(/^\[.*\]$/))
      routes.dojos_json(req, res)
      mock.verify()

  describe 'next', ->
    describe 'リファラーがある', ->
      beforeEach ->
        sinon.stub(req, 'get').withArgs('Referer').returns('http://example.org/')

      it 'next.html を sendfile する', ->
        mock = sinon.mock(res)
        mock.expects('sendfile').once().withArgs('public/next.html')
        routes.next(req, res)
        mock.verify()

    describe 'リファラーが無い', ->
      beforeEach ->
        sinon.stub(req, 'get').withArgs('Referer').returns(null)
        sinon.stub(res, 'cookie')
        sinon.stub(res, 'redirect')
        req.cookies = {}

      it 'リダイレクトする', ->
        url = 'http://sp.pf.mbga.jp/12008305/?url='+
          'http%3A%2F%2F125.6.169.35%2Fidolmaster%2Fbattle%2Fbattle_check%2F'+
          String(dojos[0].id)
        routes.next(req, res)
        expect(res.redirect.calledWith(url)).to.be.true

      it 'cookie を食べさせる', ->
        routes.next(req, res)
        expect(res.cookie.calledWith('index')).to.be.true

      it 'cookie の有効期限は翌5時', ->
        sinon.useFakeTimers(new Date(2014, 0, 31, 12).getTime())
        expires = new Date(2014, 1, 1, 5)
        routes.next(req, res)
        #expect(res.cookie.calledWith('index', sinon.match.any, {expires: expires})).to.be.true
        expect(res.cookie.getCall(0).args[2]).to.deep.equal({expires: expires})

      it '0-5 時なら cookie の有効期限は今日の5時', ->
        sinon.useFakeTimers(new Date(2014, 0, 31, 4).getTime())
        expires = new Date(2014, 0, 31, 5)
        routes.next(req, res)
        expect(res.cookie.calledWith('index', sinon.match.any, {expires: expires})).to.be.true

      it 'cookie[index] 番目の道場へ行く', ->
        req.cookies.index = '1'
        routes.next(req, res)
        expect(res.redirect.getCall(0).args[0]).to.contain(dojos[1].id)

      it 'cookie[index]+1 をクッキーにセット', ->
        req.cookies.index = '1'
        routes.next(req, res)
        expect(res.cookie.calledWith('index', '2')).to.be.true

      it 'cookie[index] >= dojos.length なら最初の道場へ', ->
        req.cookies.index = String(dojos.length)
        routes.next(req, res)
        expect(res.redirect.getCall(0).args[0]).to.contain(dojos[0].id)
        expect(res.cookie.calledWith('index', '1')).to.be.true

