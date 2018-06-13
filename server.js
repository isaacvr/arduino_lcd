/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var express = require('express');
var io      = require('socket.io');
var five    = require('johnny-five');
var sp      = require('serialport');

var board = new five.Board({ repl : false });
var lcd;
var boardConnected = false;

board.on('connect', function connectHandler() {

  console.log('Board connected');

});

board.on('ready', function readyHandler() {

  console.log('Ready!!!');

  io.emit('BOARD_CONNECTED');

  boardConnected = true;

  lcd = new five.LCD({
    pins : [7, 8, 9, 10, 11, 12],
    backlight: 6
  });

  //console.log(lcd);

});

board.on('error', function(err) {

  console.log('Board Error: ', err);

});

board.on('close', function() {

  console.log('Board disconnected. Please restart server');

  //process.stdin.write('rs\n');

});

var app = express();
var port = 3000;

app.use(express.static(__dirname));

app = app.listen(port, function() {

  console.log('Server running at http://localhost:' + port);

  //opener('http://localhost:' + port);

});

var socketListeners = {
  TEXT : function(t) {

    ///console.log('GOT: ', t);

    if ( boardConnected === true ) {
      t = t.replace(/\r/g, '');
      t = t.split('\n');

      for (var i = 0; i < t.length && i < lcd.rows; i += 1) {
        lcd.cursor(i, 0);
        lcd.print(t[i]);
      }
    }

  },
  CLEAR : function() {

    if ( boardConnected === true ) {
      lcd.clear();
    }

  }
};

io = io(app);

io.on('connection', function(socket) {

  console.log('Socket connected!!');

  for (var i in socketListeners) {

    socket.on(i.toString(), socketListeners[i]);

  }

  if ( boardConnected === true ) {
    socket.emit('BOARD_CONNECTED');
  }

});