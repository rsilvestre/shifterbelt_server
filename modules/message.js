/**
 * Created by michaelsilvestre on 19/05/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _adaptersAbsAdapterJs = require("../adapters/absAdapter.js");

var _modulesQueueJs = require("../modules/queue.js");

var _modulesQueueJs2 = _interopRequireDefault(_modulesQueueJs);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _libLoggerJs = require("../lib/logger.js");

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

/**
 * Container a dictionnary with all the talkers
 *
 * @type {{masters: {}, managers: {}, slaves: {}}}
 */
var devicesContainer = {
  masters: {},
  managers: {},
  slaves: {}
};

/**
 * Process to disconnect the talker when the server stop
 *
 * @param next
 */
var close = function close(next) {
  _libLoggerJs.logger.info("close message");

  _async2["default"].forEachOfSeries(devicesContainer, function (essaimList, deviceListKey, cbDeviceList) {
    _libLoggerJs.logger.info("disconnect device container: " + deviceListKey);

    _async2["default"].forEachOf(essaimList, function (essaim, essaimKey, cbEssaim) {
      _libLoggerJs.logger.info("disconnect device essaim: " + essaimKey);

      _async2["default"].forEachOf(essaim, function (device, deviceKey, cbDevice) {
        _libLoggerJs.logger.info("disconnect device: " + deviceKey);

        device.socket.emit("disconnect");
        device.socket.disconnect();

        cbDevice();
      }, function (err) {
        if (err) {
          console.warn(err);
          _libLoggerJs.logger.warn(err);
        }
      });

      cbEssaim();
    }, function (err) {
      if (err) {
        console.warn(err);
        _libLoggerJs.logger.warn(err);
      }
    });

    cbDeviceList();
  }, function (err) {
    if (err) {
      console.warn(err);
      _libLoggerJs.logger.warn(err);
    }

    next();
  });
};

exports.close = close;
/**
 *
 */

var LinkDevice = (function () {
  /**
   *
   * @param {Object} data
   * @param {socket.io} socket
   * @param {Function} callback
   */

  function LinkDevice(data, socket, callback) {
    _classCallCheck(this, LinkDevice);

    this._queue = new _modulesQueueJs2["default"](_adaptersAbsAdapterJs.adapters.getAdapter("queue"), data["application"]["businessId"]);
    this._socket = socket;
    this._data = data;
    this._send = null;

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}

    var Starter = (function () {
      function Starter() {
        _classCallCheck(this, Starter);
      }

      _createClass(Starter, null, [{
        key: "master",
        value: function master(context, callback) {
          context.registerMaster(callback);
        }
      }, {
        key: "manager",
        value: function manager(context, callback) {
          context.registerManager(callback);
        }
      }, {
        key: "slave",
        value: function slave(context, callback) {
          context.registerSlave(callback);
        }
      }]);

      return Starter;
    })();

    try {
      Starter[data.device.role](this, callback);
    } catch (e) {
      console.warn(new Error("The property: " + data.device.role + ", not exist: " + e));
      _libLoggerJs.logger.warn(new Error("The property: " + data.device.role + ", not exist: " + e));
    }
  }

  _createClass(LinkDevice, [{
    key: "createIfNotExistListDevices",

    /**
     *
     * @param {Function} next
     */
    value: function createIfNotExistListDevices(next) {
      if (!devicesContainer.hasOwnProperty("" + this._data.device.role + "s")) {
        return next(new Error("The container don't contain a object: " + this._data.device.role + "s"));
      }
      if (!devicesContainer["" + this._data.device.role + "s"].hasOwnProperty("" + this._data["application"]["businessId"])) {
        devicesContainer["" + this._data.device.role + "s"]["" + this._data["application"]["businessId"]] = {};
        return next();
      }
      if (devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]].hasOwnProperty(this._data["device"]["macAddress"])) {
        return next(new Error("The queue: " + this._data["device"]["role"] + ", still contain a key: " + this._data["device"]["macAddress"]));
      }
      next();
    }
  }, {
    key: "createFakeList",

    /**
     *
     * @param {Object} data
     * @returns {Object}
     */
    value: function createFakeList(data) {
      var fakeList = {};
      fakeList["" + data["application"]["businessId"]] = {};
      fakeList["" + data["application"]["businessId"]]["" + data["device"]["macAddress"]] = this;

      return fakeList;
    }
  }, {
    key: "registerMaster",

    /**
     *
     * @param {Function} next
     */
    value: function registerMaster(next) {
      var _this = this;

      this.createIfNotExistListDevices(function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.masters["" + _this._data["application"]["businessId"]]["" + _this._data["device"]["macAddress"]] = _this;

        _this.createSubQueue("pubsub", _this._data["application"]["businessId"], _this.createFakeList(_this._data), function () {
          _libLoggerJs.logger.info("" + _this._data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + _this._data["application"]["businessId"]);
          _this._queue.registerSelectorQueue("topic", function (callback) {
            _this._send = callback;
            _this._socket.on("message", function (chunk) {
              var _JSON$parse = JSON.parse(chunk);

              var key = _JSON$parse.key;
              var message = _JSON$parse.message;

              if (message) {
                return callback(message, key);
              }
              return callback(chunk);
            });
            next(null, _this._data["device"], devicesContainer.slaves["" + _this._data["application"]["businessId"]] || {});
          });
        });
      });
    }
  }, {
    key: "registerManager",

    /**
     *
     * @param {Function} next
     */
    value: function registerManager(next) {
      var _this2 = this;

      this.createIfNotExistListDevices(function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.managers["" + _this2._data["application"]["businessId"]]["" + _this2._data["device"]["macAddress"]] = _this2;

        _this2.createSubQueue("pubsub", _this2._data["application"]["businessId"], _this2.createFakeList(_this2._data), function () {
          _libLoggerJs.logger.info("" + _this2._data["device"]["macAddress"] + " has been added to the SubPub queue of the essaim " + _this2._data["application"]["businessId"]);
          _this2._queue.registerSelectorQueue("topic", function (callback) {
            _this2._send = callback;
            _this2._socket.on("message", function (chunk) {
              var _JSON$parse2 = JSON.parse(chunk);

              var key = _JSON$parse2.key;
              var message = _JSON$parse2.message;

              if (message) {
                return callback(message, key);
              }
              return callback(chunk);
            });
            next(null, _this2._data["device"], devicesContainer.slaves["" + _this2._data["application"]["businessId"]] || {});
          });
        });
      });
    }
  }, {
    key: "registerSlave",

    /**
     *
     * @param {Function} next
     */
    value: function registerSlave(next) {
      var _this3 = this;

      this.createIfNotExistListDevices(function (err) {
        if (err) {
          return next(err);
        }

        devicesContainer.slaves["" + _this3._data["application"]["businessId"]]["" + _this3._data["device"]["macAddress"]] = _this3;

        _this3.createTopicQueue("topic", _this3._data["application"]["businessId"], _this3._data["device"]["macAddress"], _this3.createFakeList(_this3._data), function () {
          _libLoggerJs.logger.info("" + _this3._data["device"]["macAddress"] + " has been added to the Topic queue of the essaim " + _this3._data["application"]["businessId"]);
          _this3._queue.registerPubQueue("pubsub", function (callback) {
            _this3._send = callback;
            callback(JSON.stringify({
              type: "service", message: {
                action: "connection",
                content: { role: "slave", status: "connected", id: _this3._data["device"]["macAddress"] },
                time: new Date()
              }
            }));
            _this3._socket.on("message", function (message) {
              var messageObj = JSON.parse(message);
              messageObj.slaveId = _this3._data["device"]["macAddress"];
              callback(JSON.stringify(messageObj));
            });
            next(null, _this3._data["device"]);
          });
        });
      });
    }
  }, {
    key: "createSubQueue",

    /**
     *
     * @param {String} queue
     * @param {String} essaim
     * @param {Object} list
     * @param {Function} next
     */
    value: function createSubQueue(queue, essaim, list, next) {
      var _this4 = this;

      var keys = Object.keys(list[essaim] || {}),
          numKey = keys.length;

      if (keys.length < 1) {
        return next();
      }

      keys.forEach(function (key) {
        _this4._queue.registerSubQueue(queue, function (message) {
          if (!message) {
            return;
          }
          _libLoggerJs.logger.info("subQueue message: " + message.content.toString());

          var _JSON$parse3 = JSON.parse(message.content.toString());

          var type = _JSON$parse3.type;
          var msg = _JSON$parse3.message;

          if (!type) {
            return list[essaim][key].socket.emit("message", message);
          }
          list[essaim][key].socket.emit(type, msg);
        }, function () {
          if (--numKey === 0) {
            next();
          }
        });
      });
    }
  }, {
    key: "createTopicQueue",

    /**
     *
     * @param {string} queue
     * @param {String} essaim
     * @param {String} deviceId
     * @param {Object} list
     * @param {Function} next
     */
    value: function createTopicQueue(queue, essaim, deviceId, list, next) {
      var _this5 = this;

      var keys = Object.keys(list[essaim] || {}),
          numKey = keys.length;

      if (keys.length < 1) {
        return next();
      }

      keys.forEach(function (key) {
        _this5._queue.registerTopicQueue(queue, ["broadcast", deviceId], function (message) {
          if (!message) {
            return;
          }
          _libLoggerJs.logger.info("topicQueue message: " + message.content.toString());
          list[essaim][key].socket.emit("message", message);
        }, function () {
          if (--numKey === 0) {
            next();
          }
        });
      });
    }
  }, {
    key: "disconnect",

    /**
     *
     * @param {*|Function} done
     */
    value: function disconnect(done) {
      var action = "disconnectFrom" + this._data["device"]["role"].charAt(0).toUpperCase() + "" + this._data["device"]["role"].slice(1);
      _libLoggerJs.logger.info("action: " + action);

      //if (!this.hasOwnProperty(action)) {
      //  throw new Error(`The property: ${action}, not exist`);
      //}
      try {
        this[action](done);
      } catch (e) {
        console.warn(new Error("The property: " + action + ", not exist: " + e));
        _libLoggerJs.logger.warn(new Error("The property: " + action + ", not exist: " + e));
      }
    }
  }, {
    key: "deleteDevice",

    /**
     *
     * @param {Function} done
     * @returns {*}
     */
    value: function deleteDevice(done) {
      done = "function" === typeof done ? done : function (value) {
        return value;
      };
      if (!devicesContainer.hasOwnProperty("" + this._data.device.role + "s")) {
        throw new Error("The deviceContainer don't contain a container: " + this._data.device.role + "s");
      }
      if (!devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]] || !devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]][this._data["device"]["macAddress"]]) {
        return done(new Error("Nothing to do"));
      }
      delete devicesContainer["" + this._data.device.role + "s"][this._data["application"]["businessId"]][this._data["device"]["macAddress"]];
      _libLoggerJs.logger.info("device: " + [this._data["device"]["macAddress"]] + ", has been removed from: " + this._data["application"]["businessId"]);
      return done();
    }
  }, {
    key: "disconnectFromMaster",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromMaster(done) {
      var _this6 = this;

      this._queue.close("pubsub", "", function () {
        _libLoggerJs.logger.info("queue for master: " + _this6._data["device"]["macAddress"] + ", has been unbinded");
        _this6.deleteDevice(done);
      });
    }
  }, {
    key: "disconnectFromManager",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromManager(done) {
      var _this7 = this;

      this._queue.close("pubsub", this._data["device"]["macAddress"], function () {
        _libLoggerJs.logger.info("queue for manager: " + _this7._data["device"]["macAddress"] + ", has been unbinded");
        _this7.deleteDevice(done);
      });
    }
  }, {
    key: "disconnectFromSlave",

    /**
     *
     * @param {Function} done
     */
    value: function disconnectFromSlave(done) {
      var _this8 = this;

      var beforeClose = function beforeClose() {
        _libLoggerJs.logger.info("queue for slave " + _this8._data["device"]["macAddress"] + ", is going to be removed from masters and managers");
        _this8._queue.close("topic", _this8._data["device"]["macAddress"], function () {
          _libLoggerJs.logger.info("queue for slave: " + _this8._data["device"]["macAddress"] + ", has been unbinded");
          _this8.deleteDevice(done);
        });
      };

      //let timeout = 20;
      //let interval = setInterval(() => {

      //logger.info('click');

      if (this._send) {
        //stopFunction();
        return this._send(JSON.stringify({
          type: "service", message: {
            action: "slaveDisconnected",
            content: { role: "slave", status: "disconnected", id: this._data["device"]["macAddress"] },
            time: new Date()
          }
        }), function () {
          setTimeout(beforeClose, 1000);
        });
      }

      return beforeClose();
      //if (--timeout < 1) {
      //  stopFunction();
      //  return done();
      //}
      //}, 1000);

      //function stopFunction() {
      //  clearInterval(interval);
      //}
    }
  }, {
    key: "socket",

    /**
     * Return socket
     * @returns {socket.io}
     */
    get: function () {
      return this._socket;
    }
  }]);

  return LinkDevice;
})();

exports.LinkDevice = LinkDevice;

/**
 *
 * @returns {*|LinkDevice.socket}
 */

//# sourceMappingURL=message.js.map