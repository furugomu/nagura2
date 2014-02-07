request = require 'request'

cache = null
cacheExpiresAt = null
# 道場リスト
exports.dojos = (callback) ->
  if cache and cacheExpiresAt and cacheExpiresAt > Date.now()
    callback(null, cache.dojo)
    return

  url = 'http://dojo.sekai.in/api/dojo.json'
  request.get url, (err, res, body) ->
    return callback(err) if err
    data = JSON.parse(body)
    cache = data
    cacheExpiresAt = Date.now() + 60 * 60 * 1000 # 60min
    callback(null, data.dojo)

# キャッシュ消す
exports.expireCache = ->
  cache = null
