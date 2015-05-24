/**
 * Created by michaelsilvestre on 20/04/15
 */

import amqp from "amqplib"
import when from "when"
import * as config from "../config/adapters.js"
import AbsAdapter from "./absAdapter.js"

export default class AmqpAdapter extends AbsAdapter {
  constructor(callback) {
    super("queue");

    this.init(callback);
  }

  init2(callback) {
    let amqpConfig = config.adapters.getConfig("queue");

    this._connection = amqp.createConnection(amqpConfig);
    this._connection.on('ready', () => {
      console.log('amqp successfull connected');
      callback(this);
    });
  }

  init(callback) {
    let amqpConfig = config.adapters.getConfig("queue");

    amqp.connect(amqpConfig.url).then((conn) => {
      console.log("amqb sub connected successfull connected");
      process.once('SIGINT', () => {
        conn.close();
      });
      return conn.createChannel().then((ch) => {
        let ok = ch.assertExchange('pubsub', 'fanout', { durable: false });

        ok = ok.then(() => {
          return ch.assertQueue('', { exclusive: true });
        });

        ok = ok.then((qok) => {
          return ch.bindQueue(qok.queue, 'pubsub', '').then(() => {
            return qok.queue;
          });
        });

        ok = ok.then((queue) => {
          return ch.consume(queue, logMessage, { noAck: true });
        });

        return ok.then(() => {
          console.log(' [*] Waiting for message');
          amqp.connect(amqpConfig.url).then((conn) => {
            console.log("amqb pub connected successfull connected");
            return when(conn.createChannel().then((ch) => {
              callback(this);
              let ex = 'pubsub';
              let ok = ch.assertExchange(ex, 'fanout', { durable: false });

              let message = 'Hello World';

              return ok.then(() => {
                ch.publish(ex, '', new Buffer(message));
                console.log(" [x] Sent '%s'", message);
                return ch.close();
              });
            })).ensure(() => {
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

  get connection() {
    return this._connection;
  }
}