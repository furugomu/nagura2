express = require 'express'
http = require 'http'
path = require 'path'

app = express()
app.set 'port', process.env.PORT || 9393
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.logger('dev')
app.use express.bodyParser()
app.use express.cookieParser()
app.use express.methodOverride()
app.use app.router
app.use express.static(path.join(__dirname, 'public'))

if app.get('env') == 'development'
  app.use express.errorHandler()

routes = require('./routes')
app.get '/', routes.index
app.get '/dojos.json', routes.dojos_json
app.get '/next', routes.next

http.createServer(app).listen app.get('port'), ->
  console.log('Express server listening on port ' + app.get('port'))
