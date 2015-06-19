/**
 * Created by michaelsilvestre on 29/05/15
 */

import { all } from "when"
import { logger } from "../lib/logger.js"

export default class Queue {
  /**
   *
   * @param {Object} queueAdapter
   * @param {String} essaim
   */
  constructor(queueAdapter, essaim) {
    this._queueAdapter = queueAdapter;
    this._essaim = essaim;
    this._qok = null;
  }

  /**
   *
   * @param {String} queue
   * @param {String} pattern
   * @param {Function} next
   * @returns {Promise|Promise.<T>|*}
   */
  close(queue, pattern, next) {
    if (this._qok) {
      let queueId = this._qok.queue;
      return this._queueAdapter.chSub.unbindQueue(queueId, `${this._essaim}|${queue}`, pattern).then(() => {
        return this._queueAdapter.chSub.deleteQueue(queueId).then(() => {
          return next();
        });
      });
    }
    return next();
  }

  /**
   *
   * @param {String} queue
   * @param {Function} subMessage
   * @param {Function} next
   * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
   */
  registerSubQueue(queue, subMessage, next) {
    let ok = this._queueAdapter.chSub.assertExchange(`${this._essaim}|${queue}`, 'fanout', { durable: false });

    ok = ok.then(() => {
      return this._queueAdapter.chSub.assertQueue('', { exclusive: true });
    });

    ok = ok.then((qok) => {
      this._qok = qok;
      return this._queueAdapter.chSub.bindQueue(qok.queue, `${this._essaim}|${queue}`, '').then(() => {
        return qok.queue;
      });
    });

    ok = ok.then((q) => {
      return this._queueAdapter.chSub.consume(q, subMessage, { noAck: true });
    });

    ok = ok.then(() => {
      logger.info(' [*] Waiting for message');
      if (next) {
        next();
      }
    });

    return ok;
  }

  /**
   *
   * @param {String} queue
   * @param {Function} subMessage
   * @param {Function} next
   * @returns {{queue, exclusive, durable, autoDelete, arguments, passive, ticket, nowait}}
   */
  registerWorkerQueue(queue, subMessage, next) {
    let ok = this._queueAdapter.chSub.assertQueue(`${this._essaim}|${queue}`, { durable: true });
    ok = ok.then(() => {
      this._queueAdapter.chSub.prefetch(1);
    });
    ok = ok.then(() => {
      return this._queueAdapter.chSub.consume(`${this._essaim}|${queue}`, subMessage, { noAck: false });
    });
    ok = ok.then(() => {
      logger.info(" [*] Waiting for messages. To exit press CTRL+C");
      if (next) {
        next();
      }
    });

    return ok;
  }

  /**
   *
   * @param {String} queue
   * @param {Array} keys
   * @param {Function} subMessage
   * @param {Function} next
   * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
   */
  registerTopicQueue(queue, keys, subMessage, next) {
    var ok = this._queueAdapter.chSub.assertExchange(`${this._essaim}|${queue}`, 'topic', { durable: false });

    ok = ok.then(() => {
      return this._queueAdapter.chSub.assertQueue('', { exclusive: true });
    });

    ok = ok.then((qok) => {
      this._qok = qok;
      var q = qok.queue;
      return all(keys.map((rk) => {
        this._queueAdapter.chSub.bindQueue(q, `${this._essaim}|${queue}`, rk);
      })).then(() => {
        return q;
      });
    });

    ok = ok.then((q) => {
      return this._queueAdapter.chSub.consume(q, subMessage, { noAck: true });
    });

    ok = ok.then(() => {
      logger.info(' [*] Waiting for logs. To exit press CTRL+C.');
      if (next) {
        next();
      }
    });

    return ok;
  }

  /**
   *
   * @param {String} queue
   * @param {Function} next
   * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
   */
  registerPubQueue(queue, next) {
    logger.info(`queue: ${this._essaim}`);
    let ok = this._queueAdapter.chPub.assertExchange(`${this._essaim}|${queue}`, 'fanout', { durable: false });

    ok = ok.then(() => {
      next((message, callback) => {
        this._queueAdapter.chPub.publish(`${this._essaim}|${queue}`, '', new Buffer(message));
        logger.info(` [x] Sent '${message}'`);
        if (callback) {
          callback();
        }
      });
    });

    return ok;
  }

  /**
   *
   * @param {String} queue
   * @param {Function} next
   * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
   */
  registerTaskQueue(queue, next) {
    logger.info(`queue: ${this._essaim}`);
    var ok = this._queueAdapter.assertQueue(`${this._essaim}|${queue}`, { durable: true });

    ok = ok.then(() => {
      next((message, callback) => {
        this._queueAdapter.chPub.sendToQueue(`${this._essaim}|${queue}`, new Buffer(message), { deliveryMode: true });
        logger.info(` [x] Sent '${message}'`);
        if (callback) {
          callback();
        }
      });
    });

    return ok;
  }

  /**
   *
   * @param {String} queue
   * @param {Function} next
   * @returns {{exchange}|{exchange, ticket, type, passive, durable, autoDelete, internal, nowait, arguments}}
   */
  registerSelectorQueue(queue, next) {
    var ok = this._queueAdapter.chPub.assertExchange(`${this._essaim}|${queue}`, 'topic', { durable: false });
    ok = ok.then(() => {
      next((message, key, callback) => {
        this._queueAdapter.chPub.publish(`${this._essaim}|${queue}`, key, new Buffer(message));
        logger.info(` [x] Sent ${key}: '${message}'`);
        if (callback) {
          callback();
        }
      });
    });

    return ok;
  }
}
