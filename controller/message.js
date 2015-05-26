/**
 * Created by michaelsilvestre on 19/05/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var masters = {};
var managers = {};
var slaves = {};

var messageInit = function messageInit() {
  var queueAdapter = _adaptersAbsAdapterJs.adapters.getAdapter("queue");
  var queue = new Queue(queueAdapter);
  queue.createTestQueue("subPub", function() {
    console.log("Test message successfull");
  });
};

exports.messageInit = messageInit;

var LinkDevice = (function() {
  function LinkDevice(data, socket, callback) {
    _classCallCheck(this, LinkDevice);

    this._queue = new Queue(_adaptersAbsAdapterJs.adapters.getAdapter("queue"));
    this._socket = socket;
    this._data = data;
    var action = "register" + data.role.charAt(0).toUpperCase() + "" + data.role.slice(1);
    console.log("action: " + action);

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    try {
      this[action](data, socket, callback);
    } catch (e) {
      console.warn(new Error("The property: " + action + ", not exist: " + e));
    }
  }

  _createClass(LinkDevice, [{
    key: "createIfNotExistListDevices",
    value: function createIfNotExistListDevices(list, data, next) {
      if (!list.hasOwnProperty(data["businessId"])) {
        list[data["businessId"].toString()] = {};
        return next();
      }
      if (list[data["businessId"]].hasOwnProperty(data["macAddress"])) {
        return next(new Error("The queue: " + data["role"] + ", still contain a key: " + data["macAddress"]));
      }
      next();
    }
  }, {
    key: "registerMaster",
    value: function registerMaster(data, socket, next) {
      var _this = this;

      this.createIfNotExistListDevices(masters, data, function(err) {
        if (err) {
          return next(err);
        }
        masters["" + data["businessId"]]["" + data["macAddress"]] = _this;
        next(null, socket);
      });
    }
  }, {
    key: "registerManager",
    value: function registerManager(data, socket, next) {
      var _this2 = this;

      this.createIfNotExistListDevices(managers, data, function(err) {
        if (err) {
          return next(err);
        }
        managers["" + data["businessId"]]["" + data["macAddress"]] = _this2;
      });
    }
  }, {
    key: "registerSlave",
    value: function registerSlave(data, socket, next) {
      var _this3 = this;

      this.createIfNotExistListDevices(slaves, data, function(err) {
        if (err) {
          return next(err);
        }
        slaves["" + data["businessId"]]["" + data["macAddress"]] = _this3;
        Object.keys(masters[data["businessId"]] || {}).forEach(function(key) {
          _this3._queue.createMasterQueue("" + data["businessId"] + "|" + data["macAddress"], function(message) {
            console.log("subQueue message: " + message.toString());
            masters[data["businessId"]][key].socket.emit("message", message);
          }, function(callback) {
            socket.on("message", callback);
            next(null, socket);
          });
        });
      });
    }
  }, {
    key: "socket",
    get: function() {
      return this._socket;
    }
  }, {
    key: "disconnect",
    value: function disconnect(done) {
      var action = "disconnectFrom" + this._data.role.charAt(0).toUpperCase() + "" + this._data.role.slice(1);
      console.log("action: " + action);

      //if (!this.hasOwnProperty(action)) {
      //  throw new Error(`The property: ${action}, not exist`);
      //}
      try {
        this[action](done);
      } catch (e) {
        console.warn(new Error("The property: " + action + ", not exist: " + e));
      }
    }
  }, {
    key: "deleteDevice",
    value: function deleteDevice(list, done) {
      done = "function" === typeof done ? done : function(value) {
        return value;
      };
      if (!list[this._data["businessId"]] || !list[this._data["businessId"]][this._data["macAddress"]]) {
        return done(new Error("Nothing to do"));
      }
      delete list[this._data["businessId"]][this._data["macAddress"]];
      console.log("device: " + [this._data["macAddress"]] + ", has been removed from: " + this._data["businessId"]);
      return done();
    }
  }, {
    key: "disconnectFromMaster",
    value: function disconnectFromMaster(done) {
      this.deleteDevice(masters, done);
    }
  }, {
    key: "disconnectFromManager",
    value: function disconnectFromManager(done) {
      this.deleteDevice(managers, done);
    }
  }, {
    key: "disconnectFromSlave",
    value: function disconnectFromSlave(done) {
      this.deleteDevice(slaves, done);
    }
  }, {
    key: "toto",
    value: function toto() {
      var _this4 = this;

      var logMessage = function logMessage(msg) {
        console.log(" [x] '%s'", msg.content.toString());
      };

      this.registrerSubQueue(queue, logMessage, function(callback) {
        callback("info: Hello World!", function() {
          next(_this4);
        });
      }, function() {
        for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
          arg[_key] = arguments[_key];
        }

        _this4.registerPubQueue.apply(_this4, arg);
      });
    }
  }]);

  return LinkDevice;
})();

exports.LinkDevice = LinkDevice;

var Queue = (function() {
  function Queue(queueAdapter) {
    _classCallCheck(this, Queue);

    this._queueAdapter = queueAdapter;
  }

  _createClass(Queue, [{
    key: "createTestQueue",
    value: function createTestQueue(queue, next) {
      var _this5 = this;

      var messageCb = function messageCb(msg) {
        console.log(" [x] '%s'", msg.content.toString());
      };

      this.registrerSubQueue(queue, messageCb, function(callback) {
        callback("info: Hello World!", function() {
          next();
        });
      }, function() {
        for (var _len2 = arguments.length, arg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        _this5.registerPubQueue.apply(_this5, arg);
      });
    }
  }, {
    key: "createMasterQueue",
    value: function createMasterQueue(queue, subMessage, pubMessage) {
      var _this6 = this;

      this.registrerSubQueue(queue, subMessage, function(callback) {
        pubMessage(function(message) {
          callback(message);
        });
      }, function() {
        for (var _len3 = arguments.length, arg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          arg[_key3] = arguments[_key3];
        }

        _this6.registerPubQueue.apply(_this6, arg);
      });
    }
  }, {
    key: "registrerSubQueue",
    value: function registrerSubQueue(queue, subMessage, callback, next) {
      var _this7 = this;

      var ok = this._queueAdapter.chSub.assertExchange(queue, "fanout", { durable: false });

      ok = ok.then(function() {
        return _this7._queueAdapter.chSub.assertQueue("", { exclusive: true });
      });

      ok = ok.then(function(qok) {
        return _this7._queueAdapter.chSub.bindQueue(qok.queue, queue, "").then(function() {
          return qok.queue;
        });
      });

      ok = ok.then(function(queue) {
        return _this7._queueAdapter.chSub.consume(queue, subMessage, { noAck: true });
      });

      ok.then(function() {
        console.log(" [*] Waiting for message");
        next(queue, callback);
      });
    }
  }, {
    key: "registerPubQueue",
    value: function registerPubQueue(queue, next) {
      var _this8 = this;

      console.log("queue " + queue);
      var ok = this._queueAdapter.chPub.assertExchange(queue, "fanout", { durable: false });

      ok.then(function() {
        next(function(message, callback) {
          console.log("message " + message);
          _this8._queueAdapter.chPub.publish(queue, "", new Buffer(message));
          console.log(" [x] Sent '%s'", message);
          //this.chPub.close();
          if (callback) {
            callback();
          }
        });
      });
    }
  }]);

  return Queue;
})();

//# sourceMappingURL=message.js.map