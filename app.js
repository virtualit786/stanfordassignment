var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('domain');

var dbOptions = require('./config/database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var routes = require('./routes/index');
var users = require('./routes/users');
var apiRoutes = require('./routes/api/api');


var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
    cluster.fork();
  });
  cluster.on('disconnect', function (worker) {
    console.log('The worker #' + worker.id + ' has disconnected');
  });

} else {
  startMongoAndExpress();

}

function setupAndStartMongoDb(app) {
  var dbConnectionString = dbOptions.getUrl(app.get('env'));
  mongoose.connect(dbConnectionString, {auto_reconnect: true}, function (err) {
    if (err) {
      console.error('Failed to connec to mongo at startup ', err);
    }
  });

  var connection = mongoose.connection;
  autoIncrement.initialize(connection);
}

function startMongoAndExpress() {

  var app = express();

// view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);
  app.use('/users', users);
  app.use('/api/v1', apiRoutes);

  function onDomainError(err) {
    console.log('\n\n\t\t*************Domain:', err.domain);
    console.error('error', er.stack);
    try {
      // make sure we close down within 30 seconds
      var killtimer = setTimeout(function () {
        process.exit(1);
      }, 30000);
      // But don't keep the process open just for that!
      killtimer.unref();
      // stop taking new requests.
      //server.close();
      cluster.worker.disconnect();
      // try to send an error to the request that triggered the problem
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain');
      res.end('Oops, there was a problem!\n');
    } catch (er2) {
      // oh well, not much we can do at this point.
      console.error('Error sending 500!', er2.stack);
    }

    res.writeHead(500);
    res.end(err.message);
  }

  setupAndStartMongoDb(app);
// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handlers

// development error handler
// will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

// production error handler
// no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  app.all('/*', function (req, res, next) {
// CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });

  app.use(function (req, res, next) {
    var requestDomain = domain.create();
    requestDomain.add(req);
    requestDomain.add(res);
    requestDomain.on('error', onDomainError);
    requestDomain.run(next);
  });

  var httpServer = http.createServer(app).listen(8000, function () {
    console.log('*******Server started');

  });

  httpServer.on('request', function (req, res) {
    var requestLog = {
      startAt: process.hrtime(),
      startTime: new Date(),
      remoteAddress: req.ip || req.remoteAddress || (req.connection && req.connection.remoteAddress) || null,
      contentType: req.headers['content-type'],
      userAgent: req.headers['user-agent'],
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params
    };
    console.log('******* Incoming Request Log ********** ' + JSON.stringify(requestLog));
  });
  module.exports = app;
}

