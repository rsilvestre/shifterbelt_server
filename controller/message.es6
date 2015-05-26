/**
 * Created by michaelsilvestre on 19/05/15
 */

import { adapters } from "../adapters/absAdapter.js";
import _ from "underscore";

let masters = {};
let managers = {};
let slaves = {};


export let messageInit = () => {
  let queueAdapter = adapters.getAdapter("queue");
  let queue = new Queue(queueAdapter);
  queue.createTestQueue('subPub', () => {
    console.log("Test message successfull")
  });
};

export class LinkDevice {
  constructor(data, socket, callback) {
    this._queue = new Queue(adapters.getAdapter('queue'));
    this._socket = socket;
    this._data = data;
    let action = `register${data.role.charAt(0).toUpperCase()}${data.role.slice(1)}`;
    console.log(`action: ${action}`);

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    try {
      this[action](data, socket, callback);
    } catch (e) {
      console.warn(new Error(`The property: ${action}, not exist: ${e}`));
    }
  }

  createIfNotExistListDevices(list, data, next) {
    if (!list.hasOwnProperty(data['businessId'])) {
      list[data['businessId'].toString()] = {};
      return next();
    }
    if (list[data['businessId']].hasOwnProperty(data['macAddress'])) {
      return next(new Error(`The queue: ${data['role']}, still contain a key: ${data['macAddress']}`));
    }
    next();
  }

  registerMaster(data, socket, next) {
    this.createIfNotExistListDevices(masters, data, (err) => {
      if (err) {
        return next(err);
      }
      masters[`${data['businessId']}`][`${data['macAddress']}`] = this;
      next(null, socket);
    });

  }

;

  registerManager(data, socket, next) {
    this.createIfNotExistListDevices(managers, data, (err) => {
      if (err) {
        return next(err);
      }
      managers[`${data['businessId']}`][`${data['macAddress']}`] = this;
    });
  }

;

  registerSlave(data, socket, next) {
    this.createIfNotExistListDevices(slaves, data, (err) => {
      if (err) {
        return next(err);
      }
      slaves[`${data['businessId']}`][`${data['macAddress']}`] = this;
      Object.keys(masters[data['businessId']] || {}).forEach((key) => {
        this._queue.createMasterQueue(`${data['businessId']}|${data['macAddress']}`, (message) => {
          console.log('subQueue message: ' + message.toString());
          masters[data['businessId']][key].socket.emit('message', message);
        }, (callback) => {
          socket.on('message', callback);
          next(null, socket);
        });
      });
    });
  }

;

  get socket() {
    return this._socket;
  }

  disconnect(done) {
    let action = `disconnectFrom${this._data.role.charAt(0).toUpperCase()}${this._data.role.slice(1)}`;
    console.log(`action: ${action}`);

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    try {
      this[action](done);
    } catch (e) {
      console.warn(new Error(`The property: ${action}, not exist: ${e}`));
    }
  }

  deleteDevice(list, done) {
    done = "function" === typeof done ? done : (value) => {
      return value
    };
    if (!list[this._data['businessId']] || !list[this._data['businessId']][this._data['macAddress']]) {
      return done(new Error('Nothing to do'));
    }
    delete(list[this._data['businessId']][this._data['macAddress']]);
    console.log(`device: ${[this._data['macAddress']]}, has been removed from: ${this._data['businessId']}`);
    return done();
  }

  disconnectFromMaster(done) {
    this.deleteDevice(masters, done);
  }

  disconnectFromManager(done) {
    this.deleteDevice(managers, done);
  }

  disconnectFromSlave(done) {
    this.deleteDevice(slaves, done);
  }

  toto() {
    let logMessage = (msg) => {
      console.log(" [x] '%s'", msg.content.toString());
    };

    this.registrerSubQueue(queue, logMessage, (callback) => {
      callback('info: Hello World!', () => {
        next(this);
      });
    }, (...arg) => {
      this.registerPubQueue(...arg);
    });

  }

;
}

class Queue {
  constructor(queueAdapter) {
    this._queueAdapter = queueAdapter;
  }

  createTestQueue(queue, next) {
    let messageCb = (msg) => {
      console.log(" [x] '%s'", msg.content.toString());
    };

    this.registrerSubQueue(queue, messageCb, (callback) => {
      callback('info: Hello World!', () => {
        next();
      });
    }, (...arg) => {
      this.registerPubQueue(...arg);
    });
  }

  createMasterQueue(queue, subMessage, pubMessage) {

    this.registrerSubQueue(queue, subMessage, (callback) => {
      pubMessage((message) => {
        callback(message);
      });
    }, (...arg) => {
      this.registerPubQueue(...arg);
    });
  }

  registrerSubQueue(queue, subMessage, callback, next) {
    let ok = this._queueAdapter.chSub.assertExchange(queue, 'fanout', { durable: false });

    ok = ok.then(() => {
      return this._queueAdapter.chSub.assertQueue('', { exclusive: true });
    });

    ok = ok.then((qok) => {
      return this._queueAdapter.chSub.bindQueue(qok.queue, queue, '').then(() => {
        return qok.queue;
      });
    });

    ok = ok.then((queue) => {
      return this._queueAdapter.chSub.consume(queue, subMessage, { noAck: true });
    });

    ok.then(() => {
      console.log(' [*] Waiting for message');
      next(queue, callback);
    });

  }

  registerPubQueue(queue, next) {
    console.log(`queue ${queue}`);
    let ok = this._queueAdapter.chPub.assertExchange(queue, 'fanout', { durable: false });

    ok.then(() => {
      next((message, callback) => {
        console.log(`message ${message}`);
        this._queueAdapter.chPub.publish(queue, '', new Buffer(message));
        console.log(" [x] Sent '%s'", message);
        //this.chPub.close();
        if (callback) {
          callback();
        }
      });
    });

  }
}
