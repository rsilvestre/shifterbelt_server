/**
 * Created by michaelsilvestre on 19/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mssqlAdapterJs = require("./mssql-adapter.js");

var _mssqlAdapterJs2 = _interopRequireDefault(_mssqlAdapterJs);

var _redisAdapterJs = require("./redis-adapter.js");

var _redisAdapterJs2 = _interopRequireDefault(_redisAdapterJs);

var _rabbitmqAdapterJs = require("./rabbitmq-adapter.js");

var _rabbitmqAdapterJs2 = _interopRequireDefault(_rabbitmqAdapterJs);

var _amqpAdapterJs = require("./amqp-adapter.js");

var _amqpAdapterJs2 = _interopRequireDefault(_amqpAdapterJs);

var _websocketAdapterJs = require("./websocket-adapter.js");

var _websocketAdapterJs2 = _interopRequireDefault(_websocketAdapterJs);

var _mongooseAdapterJs = require("./mongoose-adapter.js");

var _mongooseAdapterJs2 = _interopRequireDefault(_mongooseAdapterJs);

exports["default"] = {
  mssqlAdapter: _mssqlAdapterJs2["default"],
  redisAdapter: _redisAdapterJs2["default"],
  rabbitAdapter: _rabbitmqAdapterJs2["default"],
  amqpAdapter: _amqpAdapterJs2["default"],
  wsAdapter: _websocketAdapterJs2["default"],
  mongooseAdapter: _mongooseAdapterJs2["default"]
};
module.exports = exports["default"];

//# sourceMappingURL=index.js.map