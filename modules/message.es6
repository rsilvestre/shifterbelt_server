/**
 * Created by michaelsilvestre on 19/05/15
 */

import { adapters } from "../adapters/absAdapter.js";
import Queue from '../modules/queue.js'
import _ from "underscore";

let masters = {};
let managers = {};
let slaves = {};

export class LinkDevice {
  /**
   *
   * @param {{}} data
   * @param {socket.io} socket
   * @param {Function} callback
   */
  constructor(data, socket, callback) {
    this._queue = new Queue(adapters.getAdapter('queue'), data['application']['businessId']);
    this._socket = socket;
    this._data = data;
    this._send = null;
    let action = `register${data['device']['role'].charAt(0).toUpperCase()}${data['device']['role'].slice(1)}`;
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

  /**
   *
   * @param {Object} list
   * @param {{}} data
   * @param {Function} next
   */
  createIfNotExistListDevices(list, data, next) {
    if (!list.hasOwnProperty(data['application']['businessId'])) {
      list[data['application']['businessId'].toString()] = {};
      return next();
    }
    if (list[data['application']['businessId']].hasOwnProperty(data['device']['macAddress'])) {
      return next(new Error(`The queue: ${data['device']['role']}, still contain a key: ${data['device']['macAddress']}`));
    }
    next();
  }

  /**
   *
   * @param {{}} data
   * @returns {{}}
   */
  createFakeList(data) {
    let fakeList = {};
    fakeList[`${data['application']['businessId']}`] = {};
    fakeList[`${data['application']['businessId']}`][`${data['device']['macAddress']}`] = this;

    return fakeList;
  }

  /**
   *
   * @param {{}} data
   * @param {socket.io} socket
   * @param {Function} next
   */
  registerMaster(data, socket, next) {
    this.createIfNotExistListDevices(masters, data, (err) => {
      if (err) {
        return next(err);
      }

      masters[`${data['application']['businessId']}`][`${data['device']['macAddress']}`] = this;

      this.createSubQueue(`pubsub`, data['application']['businessId'], this.createFakeList(data), () => {
        console.log(`${data['device']['macAddress']} has been added to the SubPub queue of the essaim ${data['application']['businessId']}`);
        this._queue.registerSelectorQueue(`topic`, (callback) => {
          this._send = callback;
          socket.on('message', (chunk) => {
            let { key, message } = JSON.parse(chunk);
            if (message) {
              return callback(message, key);
            }
            return callback(chunk);
          });
          next(null, data['device'], slaves[`${data['application']['businessId']}`] || {});
        });
      });

    });

  }

  /**
   *
   * @param {{}} data
   * @param {socket.io} socket
   * @param {Function} next
   */
  registerManager(data, socket, next) {
    this.createIfNotExistListDevices(managers, data, (err) => {
      if (err) {
        return next(err);
      }
      managers[`${data['application']['businessId']}`][`${data['device']['macAddress']}`] = this;
    });
  }

  /**
   *
   * @param {{}} data
   * @param {socket.io} socket
   * @param {Function} next
   */
  registerSlave(data, socket, next) {
    this.createIfNotExistListDevices(slaves, data, (err) => {
      if (err) {
        return next(err);
      }

      slaves[`${data['application']['businessId']}`][`${data['device']['macAddress']}`] = this;

      this.createTopicQueue(`topic`, data['application']['businessId'], data['device']['macAddress'], this.createFakeList(data), () => {
        console.log(`${data['device']['macAddress']} has been added to the Topic queue of the essaim ${data['application']['businessId']}`);
        this._queue.registerPubQueue(`pubsub`, (callback) => {
          this._send = callback;
          callback(JSON.stringify({
            type: 'service', message: {
              action: 'connection',
              content: { role: 'slave', status: 'connected', id: data['device']['macAddress'] },
              time: new Date()
            }
          }));
          socket.on('message', (message) => {
            let messageObj = JSON.parse(message);
            messageObj.slaveId = data['device']['macAddress'];
            callback(JSON.stringify(messageObj));
          });
          next(null, data['device']);
        });
      });

    });
  }

  /**
   *
   * @param {String} queue
   * @param {String} essaim
   * @param {{}} list
   * @param {Function} next
   */
  createSubQueue(queue, essaim, list, next) {
    let keys = Object.keys(list[essaim] || {})
      , numKey = keys.length;

    if (keys.length < 1) {
      return next();
    }

    keys.forEach((key) => {
      this._queue.registerSubQueue(queue, (message) => {
        console.log('subQueue message: ' + message.content.toString());
        let {type: type, message: msg} = JSON.parse(message.content.toString());
        if (!type) {
          return list[essaim][key].socket.emit('message', message);
        }
        list[essaim][key].socket.emit(type, msg);
      }, () => {
        if (--numKey === 0) {
          next();
        }
      });
    });
  }

  /**
   *
   * @param {string} queue
   * @param {String} essaim
   * @param {String} deviceId
   * @param {{}} list
   * @param {Function} next
   */
  createTopicQueue(queue, essaim, deviceId, list, next) {
    let keys = Object.keys(list[essaim] || {})
      , numKey = keys.length;

    if (keys.length < 1) {
      return next();
    }

    keys.forEach((key) => {
      this._queue.registerTopicQueue(queue, ["broadcast", deviceId], (message) => {
        console.log('topicQueue message: ' + message.content.toString());
        list[essaim][key].socket.emit('message', message);
      }, () => {
        if (--numKey === 0) {
          next();
        }
      });
    });
  }

  /**
   *
   * @returns {*|LinkDevice.socket}
   */
  get socket() {
    return this._socket;
  }

  /**
   *
   * @param {*|Function} done
   */
  disconnect(done) {
    let action = `disconnectFrom${this._data['device']['role'].charAt(0).toUpperCase()}${this._data['device']['role'].slice(1)}`;
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

  /**
   *
   * @param {{}} list
   * @param {Function} done
   * @returns {*}
   */
  deleteDevice(list, done) {
    done = "function" === typeof done ? done : (value) => {
      return value;
    };
    if (!list[this._data['application']['businessId']] || !list[this._data['application']['businessId']][this._data['device']['macAddress']]) {
      return done(new Error('Nothing to do'));
    }
    delete(list[this._data['application']['businessId']][this._data['device']['macAddress']]);
    console.log(`device: ${[this._data['device']['macAddress']]}, has been removed from: ${this._data['application']['businessId']}`);
    return done();
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromMaster(done) {
    this._queue.close(`pubsub`, '', () => {
      console.log(`queue for master: ${this._data['device']['macAddress']}, has been unbinded`);
      this.deleteDevice(masters, done);
    });
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromManager(done) {
    this._queue.close(`pubsub`, this._data['device']['macAddress'], () => {
      console.log(`queue for manager: ${this._data['device']['macAddress']}, has been unbinded`);
      this.deleteDevice(managers, done);
    });
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromSlave(done) {
    let beforeClose = () => {
      console.log(`queue for slave ${this._data['device']['macAddress']}, has been removed from masters and managers`);
      this._queue.close(`topic`, this._data['device']['macAddress'], () => {
        console.log(`queue for slave: ${this._data['device']['macAddress']}, has been unbinded`);
        this.deleteDevice(slaves, done);
      });
    };

    let timeout = 20, interval = setInterval(() => {

      console.log('click');

      if (this._send) {
        stopFunction();
        this._send(JSON.stringify({
          type: 'service', message: {
            action: 'slaveDisconnected',
            content: { role: 'slave', status: 'disconnected', id: this._data['device']['macAddress'] },
            time: new Date()
          }
        }), beforeClose);
      }
      if (--timeout < 1) {
        stopFunction();
        return next();
      }
    }, 1000);

    function stopFunction() {
      clearInterval(interval);
    }
  }

}

