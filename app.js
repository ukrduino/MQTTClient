var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mqtt = require('mqtt');
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: false,
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://192.168.0.112', options);
client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe('test/topic', function() {
        // when a message arrives, do something with it
    });

    // publish a message to a topic
    client.publish('test/topic', 'my message', function() {
        console.log("Message is published");
 //       client.end(); // Close the connection when published
    });
});

client.on('message', function(topic, message, packet) {
    console.log("Received '" + message + "' on '" + topic + "'");
});

var io = require('socket.io').listen(5000);

io.sockets.on('connection', function (socket) {
    socket.on('publish', function (data) {
        client.publish(data.topic, data.payload);
        console.log('Publish to '+ data.payload);
    });
});

module.exports = app;
