/**
 * Created by michaelsilvestre on 19/04/15
 */

import MssqlAdapter from './mssql-adapter.js'
import RedisAdapter from './redis-adapter.js'
import RabbitAdapter from './rabbitmq-adapter.js'
import AmqpAdapter from './amqp-adapter.js'

export var adapters = {
    mssqlAdapter: MssqlAdapter,
    redisAdapter: RedisAdapter,
    rabbitAdapter: RabbitAdapter,
    amqpAdapter: AmqpAdapter
};