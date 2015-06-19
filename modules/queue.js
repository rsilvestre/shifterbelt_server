/**
 * Created by michaelsilvestre on 29/05/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _when = require("when");

var _libLoggerJs = require("../lib/logger.js");

var Queue = (function () {
  /**
   *
   * @param {Object} queueAdapter
   * @param {String} essaim
   */

  function Queue(queueAdapter, essaim) {
    _classCallCheck(this, Queue);

    this._queueAdapter = queueAdapter;
    this._essaim = essaim;
    this._qok = null;
  }

  _createClass(Queue, [{
    key: "close",

    /**
     *
     * @param {String} queue
     * @param {String} pattern
     * @param {Function} next
     * @returns {Promise|Promise.<T>|*}
     */
    value: function close(queue, pattern, next) {
      var _this = this;

      if (this._qok) {
        var _ret = (function () {
          var queueId = _this._qok.queue;
          return {
            v: _this._queueAdapter.chSub.unbindQueue(queueId, "" + _this._essaim + "|" + queue, pattern).then(function () {
              return _this._queueAdapter.chSub.deleteQueue(queueId).then(function () {
                return next();
              });
            })
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      }
      return next();
    }
  }, {
    key: "registerSubQueue",

    /**
     *
     * @param {String} queue
     * @param {Function} subMessage
     * @param {Function} next
     * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
     */
    value: function registerSubQueue(queue, subMessage, next) {
      var _this2 = this;

      var ok = this._queueAdapter.chSub.assertExchange("" + this._essaim + "|" + queue, "fanout", { durable: false });

      ok = ok.then(function () {
        return _this2._queueAdapter.chSub.assertQueue("", { exclusive: true });
      });

      ok = ok.then(function (qok) {
        _this2._qok = qok;
        return _this2._queueAdapter.chSub.bindQueue(qok.queue, "" + _this2._essaim + "|" + queue, "").then(function () {
          return qok.queue;
        });
      });

      ok = ok.then(function (q) {
        return _this2._queueAdapter.chSub.consume(q, subMessage, { noAck: true });
      });

      ok = ok.then(function () {
        _libLoggerJs.logger.info(" [*] Waiting for message");
        if (next) {
          next();
        }
      });

      return ok;
    }
  }, {
    key: "registerWorkerQueue",

    /**
     *
     * @param {String} queue
     * @param {Function} subMessage
     * @param {Function} next
     * @returns {{queue, exclusive, durable, autoDelete, arguments, passive, ticket, nowait}}
     */
    value: function registerWorkerQueue(queue, subMessage, next) {
      var _this3 = this;

      var ok = this._queueAdapter.chSub.assertQueue("" + this._essaim + "|" + queue, { durable: true });
      ok = ok.then(function () {
        _this3._queueAdapter.chSub.prefetch(1);
      });
      ok = ok.then(function () {
        return _this3._queueAdapter.chSub.consume("" + _this3._essaim + "|" + queue, subMessage, { noAck: false });
      });
      ok = ok.then(function () {
        _libLoggerJs.logger.info(" [*] Waiting for messages. To exit press CTRL+C");
        if (next) {
          next();
        }
      });

      return ok;
    }
  }, {
    key: "registerTopicQueue",

    /**
     *
     * @param {String} queue
     * @param {Array} keys
     * @param {Function} subMessage
     * @param {Function} next
     * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
     */
    value: function registerTopicQueue(queue, keys, subMessage, next) {
      var _this4 = this;

      var ok = this._queueAdapter.chSub.assertExchange("" + this._essaim + "|" + queue, "topic", { durable: false });

      ok = ok.then(function () {
        return _this4._queueAdapter.chSub.assertQueue("", { exclusive: true });
      });

      ok = ok.then(function (qok) {
        _this4._qok = qok;
        var q = qok.queue;
        return (0, _when.all)(keys.map(function (rk) {
          _this4._queueAdapter.chSub.bindQueue(q, "" + _this4._essaim + "|" + queue, rk);
        })).then(function () {
          return q;
        });
      });

      ok = ok.then(function (q) {
        return _this4._queueAdapter.chSub.consume(q, subMessage, { noAck: true });
      });

      ok = ok.then(function () {
        _libLoggerJs.logger.info(" [*] Waiting for logs. To exit press CTRL+C.");
        if (next) {
          next();
        }
      });

      return ok;
    }
  }, {
    key: "registerPubQueue",

    /**
     *
     * @param {String} queue
     * @param {Function} next
     * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
     */
    value: function registerPubQueue(queue, next) {
      var _this5 = this;

      _libLoggerJs.logger.info("queue: " + this._essaim);
      var ok = this._queueAdapter.chPub.assertExchange("" + this._essaim + "|" + queue, "fanout", { durable: false });

      ok = ok.then(function () {
        next(function (message, callback) {
          _this5._queueAdapter.chPub.publish("" + _this5._essaim + "|" + queue, "", new Buffer(message));
          _libLoggerJs.logger.info(" [x] Sent '" + message + "'");
          if (callback) {
            callback();
          }
        });
      });

      return ok;
    }
  }, {
    key: "registerTaskQueue",

    /**
     *
     * @param {String} queue
     * @param {Function} next
     * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
     */
    value: function registerTaskQueue(queue, next) {
      var _this6 = this;

      _libLoggerJs.logger.info("queue: " + this._essaim);
      var ok = this._queueAdapter.assertQueue("" + this._essaim + "|" + queue, { durable: true });

      ok = ok.then(function () {
        next(function (message, callback) {
          _this6._queueAdapter.chPub.sendToQueue("" + _this6._essaim + "|" + queue, new Buffer(message), { deliveryMode: true });
          _libLoggerJs.logger.info(" [x] Sent '" + message + "'");
          if (callback) {
            callback();
          }
        });
      });

      return ok;
    }
  }, {
    key: "registerSelectorQueue",

    /**
     *
     * @param {String} queue
     * @param {Function} next
     * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
     */
    value: function registerSelectorQueue(queue, next) {
      var _this7 = this;

      var ok = this._queueAdapter.chPub.assertExchange("" + this._essaim + "|" + queue, "topic", { durable: false });
      ok = ok.then(function () {
        next(function (message, key, callback) {
          _this7._queueAdapter.chPub.publish("" + _this7._essaim + "|" + queue, key, new Buffer(message));
          _libLoggerJs.logger.info(" [x] Sent " + key + ": '" + message + "'");
          if (callback) {
            callback();
          }
        });
      });

      return ok;
    }
  }]);

  return Queue;
})();

exports["default"] = Queue;
module.exports = exports["default"];

//# sourceMappingURL=queue.js.map