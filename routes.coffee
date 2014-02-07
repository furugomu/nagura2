models = require './models'

exports.index = (req, res) ->
  res.sendfile 'public/index.html'

exports.dojos_json = (req, res) ->
  res.setHeader('application/json')
  models.dojos (err, dojos) ->
    if (err)
      console.error(err)
      res.send(err)
      return
    res.send(JSON.stringify(dojos))

exports.next = (req, res) ->
  if req.get('Referer')
    res.sendfile 'public/next.html'
    return
  models.dojos (err, dojos) ->
    index = Number(req.cookies.index || 0)
    index = 0 if index >= dojos.length
    dojo = dojos[index]
    res.cookie('index', String(++index), {expires: next5ji()})
    url = 'http://sp.pf.mbga.jp/12008305/?url=' + encodeURIComponent(
      'http://125.6.169.35/idolmaster/battle/battle_check/'+dojo.id)
    res.redirect(url)

next5ji = ->
  t = new Date()
  day = t.getDate()
  day += 1 if t.getHours() >= 5
  new Date(t.getFullYear(), t.getMonth(), day, 5)

