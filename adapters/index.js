"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { "default": obj };
};

/**
 * Created by michaelsilvestre on 19/04/15
 */

var _MssqlAdapter = require("./mssql-adapter.js");

var _MssqlAdapter2 = _interopRequireDefault(_MssqlAdapter);

var _RedisAdapter = require("./redis-adapter.js");

var _RedisAdapter2 = _interopRequireDefault(_RedisAdapter);

var _RabbitAdapter = require("./rabbitmq-adapter.js");

var _RabbitAdapter2 = _interopRequireDefault(_RabbitAdapter);

var _AmqpAdapter = require("./amqp-adapter.js");

var _AmqpAdapter2 = _interopRequireDefault(_AmqpAdapter);

var _WebsocketAdapter = require("./websocket-adapter.js");

var _WebsocketAdapter2 = _interopRequireDefault(_WebsocketAdapter);

var _MongooseAdapter = require("./mongoose-adapter.js");

var _MongooseAdapter2 = _interopRequireDefault(_MongooseAdapter);

var adapters = {
    mssqlAdapter: _MssqlAdapter2["default"],
    redisAdapter: _RedisAdapter2["default"],
    rabbitAdapter: _RabbitAdapter2["default"],
    amqpAdapter: _AmqpAdapter2["default"],
    wsAdapter: _WebsocketAdapter2["default"],
    mongooseAdapter: _MongooseAdapter2["default"]
};
exports.adapters = adapters;

//# sourceMappingURL=index.js.map