mocha = require 'mocha'
chai = require 'chai'
chai.should()
sinon = require 'sinon'

routes = require '../routes'

express = require 'express'
models = require '../models'

describe 'routes', ->
  req = null
  res = null
  beforeEach ->
    app = express()
    req = app.request
    res = app.response
    sinon.stub(models, 'dojos').callsArgWith(0, null, [{id: 1}])

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
      mock.expects('setHeader').withArgs('application/json')
      mock.expects('send').once().withArgs(sinon.match(/^\[.*\]$/))
      routes.dojos_json(req, res)
      mock.verify()
