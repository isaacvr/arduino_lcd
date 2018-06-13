var five = require('johnny-five');

var board = new five.Board({ repl: false });

board.on('connect', function connectHandler() {

  console.log('Board connected');

});

board.on('ready', function readyHandler() {

  console.log('Ready!!!');

  console.log(board);

  process.exit();

});

board.on('error', function errorHandler(err) {

  console.log('Board Error: ', err);

})

board.on('close', function closeHandler() {

  console.log('Close!!');

});

board.on('disconnect', function disconnectHandler() {

  console.log('Disconnect');

});