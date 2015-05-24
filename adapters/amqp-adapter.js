"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _interopRequireWildcard = function(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }
    newObj["default"] = obj;
    return newObj;
  }
};

var _interopRequireDefault = function(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
};

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) {
  var _again = true;
  _function: while (_again) {
    desc = parent = getter = undefined;
    _again = false;
    var object = _x,
      property = _x2,
      receiver = _x3;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  }
};

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

/**
 * Created by michaelsilvestre on 20/04/15
 */

var _amqp = require("amqplib");

var _amqp2 = _interopRequireDefault(_amqp);

var _when = require("when");

var _when2 = _interopRequireDefault(_when);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireDefault(_AbsAdapter2);

var AmqpAdapter = (function (_AbsAdapter) {
  function AmqpAdapter(callback) {
    _classCallCheck(this, AmqpAdapter);

    _get(Object.getPrototypeOf(AmqpAdapter.prototype), "constructor", this).call(this, "queue");

    this.init(callback);
  }

  _inherits(AmqpAdapter, _AbsAdapter);

  _createClass(AmqpAdapter, [{
    key: "init2",
    value: function init2(callback) {
      var _this2 = this;

      var amqpConfig = config.adapters.getConfig("queue");

      this._connection = _amqp2["default"].createConnection(amqpConfig);
      this._connection.on("ready", function() {
        console.log("amqp successfull connected");
        callback(_this2);
      });
    }
  }, {
    key: "init",
    value: function init(callback) {
      var _this3 = this;

      var amqpConfig = config.adapters.getConfig("queue");

      _amqp2["default"].connect(amqpConfig.url).then(function(conn) {
        console.log("amqb sub connected successfull connected");
        process.once("SIGINT", function() {
          conn.close();
        });
        return conn.createChannel().then(function(ch) {
          var ok = ch.assertExchange("pubsub", "fanout", { durable: false });

          ok = ok.then(function() {
            return ch.assertQueue("", { exclusive: true });
          });

          ok = ok.then(function(qok) {
            return ch.bindQueue(qok.queue, "pubsub", "").then(function() {
              return qok.queue;
            });
          });

          ok = ok.then(function(queue) {
            return ch.consume(queue, logMessage, { noAck: true });
          });

          return ok.then(function() {
            console.log(" [*] Waiting for message");
            _amqp2["default"].connect(amqpConfig.url).then(function(conn) {
              console.log("amqb pub connected successfull connected");
              return _when2["default"](conn.createChannel().then(function(ch) {
                callback(_this3);
                var ex = "pubsub";
                var ok = ch.assertExchange(ex, "fanout", { durable: false });

                var message = "Hello World";

                return ok.then(function() {
                  ch.publish(ex, "", new Buffer(message));
                  console.log(" [x] Sent '%s'", message);
                  return ch.close();
                });
              })).ensure(function() {
                conn.close();
              });
            }).then(null, console.warn);
          });

          function logMessage(msg) {
            console.log(" [x] '%s'", msg.content.toString());
          }
        });
      }).then(null, console.warn);
    }
  }, {
    key: "connection",
    get: function() {
      return this._connection;
    }
  }]);

  return AmqpAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = AmqpAdapter;
module.exports = exports["default"];

//# sourceMappingURL=amqp-adapter.js.map