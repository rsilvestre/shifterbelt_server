/**
 * Created by michaelsilvestre on 19/04/15
 */

//import MssqlAdapter from "./mssql-adapter.js"
//import RabbitAdapter from "./rabbitmq-adapter.js"
import RedisAdapter from "./redis-adapter.js"
import AmqpAdapter from "./amqp-adapter.js"
import WebsocketAdapter from "./websocket-adapter.js"
import MongooseAdapter from "./mongoose-adapter.js"

export default {
    //mssqlAdapter: MssqlAdapter,
    //rabbitAdapter: RabbitAdapter,
    redisAdapter: RedisAdapter,
    amqpAdapter: AmqpAdapter,
    wsAdapter: WebsocketAdapter,
    mongooseAdapter: MongooseAdapter
};