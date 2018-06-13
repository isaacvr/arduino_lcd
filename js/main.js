/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

"use strict";

var isElectron;

function getRequire() {

  if ( typeof require != 'undefined' ) {

    isElectron = true;

    return require;

  } else {

    isElectron = false;

    return function(path) {

      var res = null;

      if ( /\.js$/.test(path) === true ) {
        res = document.createElement('script');
        res.setAttribute("type", "text/javascript");
        res.src = path;
      }

      if (res == null) {
        res = document.createElement('div');
      }

      return res;

    };
  }

}

var __require = getRequire();

if ( isElectron === false ) {
  console.log('Browser directly!!!');
  //document.body.appendChild(__require('js/jquery.min.js'));
  //document.body.appendChild(__require('js/bootstrap.min.js'));
} else {
  console.log('Electron environment!!!');
  var jQuery    = require('./js/jquery.min.js');
  var bootstrap = require('./js/bootstrap.min.js');
  var fs        = require('fs');
  var five      = require('johnny-five');
  var sp        = require('browser-serialport');

}

var myApp = angular.module("arduinoTester", []);

myApp.controller('arduinoController', [
  '$scope',
  '$window',
  function($scope, $window) {

    $scope.pinModes = [];

    $scope.boards = [];

    $scope.lcd = [
      [ { data : 'H' }, { data : 'E'}, { data : 'L' }, { data : 'O'} ],
      [ { data : 'W' }, { data : 'O'}, { data : 'R' }, { data : 'L'}, { data : 'D' } ],
    ];

    $scope.rows = 2;
    $scope.cols = 16;

    $scope.boardConnected = false;

    $scope.text = '';

    $scope.watcher = function watcher() {

      $scope.lcd = [];

      for (var i = 0; i < $scope.rows; i += 1) {

        var aux = [];

        for (var j = 0; j < $scope.cols; j += 1) {
          aux.push({
            data : ''
          });
        }

        $scope.lcd.push(aux);

      }

      $scope.updateLcd();

    };

    $scope.clearLcd = function clearLcd() {

      for (var i = 0; i < $scope.rows; i += 1) {
        for (var j = 0; j < $scope.cols; j += 1) {
          $scope.lcd[i][j].data = '';
        }
      }

    };

    $scope.updateLcd = function updateLcd() {

      var arr = $scope.text.replace(/\r/g, '').split('\n');

      $scope.clearLcd();

      for (var i = 0; i < arr.length && i < $scope.rows; i += 1) {
        for (var j = 0; j < arr[i].length && j < $scope.cols; j += 1) {
          $scope.lcd[i][j].data = arr[i][j];
        }
      }

    };

    $scope.$watch('rows', $scope.watcher);
    $scope.$watch('cols', $scope.watcher);

    $scope.$watch('text', $scope.updateLcd);

    $scope.sendText = function() {

      if ( $scope.boardConnected === true ) {
        $scope.socket.emit('TEXT', $scope.text);
      }

    };

    $scope.clearText = function() {

      if ( $scope.boardConnected === true ) {

        $scope.socket.emit('CLEAR');

        $scope.text = '';

      }

    };

    var socketListeners = {
      BOARD_CONNECTED : function() {
        $scope.$apply(function() {
          $scope.boardConnected = true;
        });
      },
      disconnected : function() {
        $scope.boardConnected = false;
      }
    };

    if ( isElectron === true ) {

    } else {

      $scope.socket = io($window.location.toString());

      for (var i in socketListeners) {
        $scope.socket.on(i.toString(), socketListeners[i]);
      }

    }

  }
]);