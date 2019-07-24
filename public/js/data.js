Demo.Data = (function() {
  'use strict';

  var getFromServer = function(url, async, succ_callback, err_callback) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        succ_callback(this.responseText);
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('content-Type', 'application/json; charset=utf-8');
    xhr.send(data);
  };

  var getFromServerWithHeader = function(url, header, async, succ_callback, err_callback) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        succ_callback(this.responseText);
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('content-Type', 'application/json; charset=utf-8');
    xhr.send(data);
  };

  var sendToServer = function(url, type, sendData, succ_callback, err_callback) {
    var data = JSON.stringify(sendData);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        succ_callback(this.responseText);
      }
    });

    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
  };

  var postToServerWithHeader = function(url, header, type, sendData, succ_callback, err_callback) {
    var data = JSON.stringify(sendData);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        succ_callback(this.responseText);
      }
    });

    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
  };

  var deleteFromServer = function(url, header, succ_callback, err_callback) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        succ_callback(this.responseText);
      }
    });

    xhr.open('DELETE', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
  };

  return {
    getFromServer: getFromServer,
    getFromServerWithHeader: getFromServerWithHeader,
    sendToServer: sendToServer,
    postToServerWithHeader: postToServerWithHeader,
    deleteFromServer: deleteFromServer,
  };
})();
