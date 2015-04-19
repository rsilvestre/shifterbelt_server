'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
/**
 * Created by michaelsilvestre on 19/04/15
 */

var _MssqlAdapter = require('./mssql-adapter.js');

var _MssqlAdapter2 = _interopRequireWildcard(_MssqlAdapter);

var _RedisAdapter = require('./redis-adapter.js');

var _RedisAdapter2 = _interopRequireWildcard(_RedisAdapter);

var _RabbitAdapter = require('./rabbitmq-adapter.js');

var _RabbitAdapter2 = _interopRequireWildcard(_RabbitAdapter);

var adapters = {
    mssqlAdapter: _MssqlAdapter2['default'],
    redisAdapter: _RedisAdapter2['default'],
    rabbitAdapter: _RabbitAdapter2['default']
};
exports.adapters = adapters;

//# sourceMappingURL=index.js.map