models = require './models'

exports.index = (req, res) ->
  res.sendfile 'public/index.html'

exports.dojos_json = (req, res) ->
  res.setHeader('application/json')
  models.dojos (err, dojos) ->
    res.send(JSON.stringify(dojos))
