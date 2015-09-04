var express = require('express')
    ,path = require('path')
    ,favicon = require('serve-favicon')
    ,logger = require('morgan')
    ,cookieParser = require('cookie-parser')
    ,bodyParser = require('body-parser')
    ,settings = require('./settings')
    ,session = require('express-session')
    ,routes = require('./serverScripts/index')
    ,partials =require('express-partials')
    ,jwt = require('express-jwt');

var MongoStore = require('connect-mongo')(session)
    ,app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));
app.use(express.static(path.join(__dirname, 'public')
    /*,{
    maxAge:60 * 60 * 24 * 365

}*/
));

app.use('/api', jwt({secret: settings.jwtSecret}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
