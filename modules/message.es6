/**
 * Created by michaelsilvestre on 19/05/15
 */

import { adapters } from "../adapters/absAdapter.js";
import Queue from '../modules/queue.js'
import _ from "underscore";
import { logger } from "../lib/logger.js"
import async from 'async'

/**
 * Container a dictionnary with all the talkers
 *
 * @type {{masters: {}, managers: {}, slaves: {}}}
 */
let devicesContainer = {
  masters: {},
  managers: {},
  slaves: {}
};

/**
 * Process to disconnect the talker when the server stop
 *
 * @param next
 */
export let close1 = (next) => {
  logger.info('close message');

  Object.keys(devicesContainer).forEach((deviceListKey) => {
    logger.info(`disconnect device container: ${deviceListKey}`);

    Object.keys(devicesContainer[deviceListKey]).forEach((essaimKey) => {
      logger.info(`disconnect device essaim: ${essaimKey}`);

      Object.keys(devicesContainer[deviceListKey][essaimKey]).forEach((deviceKey) => {
        logger.info(`disconnect device: ${deviceKey}`);

        let device = devicesContainer[deviceListKey][essaimKey][deviceKey];
        device.socket.emit('disconnect');
        device.socket.disconnect();
      });
    });
  });

  next();
};

/**
 * Process to disconnect the talker when the server stop
 *
 * @param next
 */
export let close = (next) => {
  logger.info('close message');

  async.forEachOfSeries(devicesContainer, (essaimList, deviceListKey, cbDeviceList) => {
    logger.info(`disconnect device container: ${deviceListKey}`);

    async.forEachOf(essaimList, (essaim, essaimKey, cbEssaim) => {
      logger.info(`disconnect device essaim: ${essaimKey}`);

      async.forEachOf(essaim, (device, deviceKey, cbDevice) => {
        logger.info(`disconnect device: ${deviceKey}`);

        device.socket.emit('disconnect');
        device.socket.disconnect();

        cbDevice();
      }, (err) => {
        if (err) {
          console.warn(err);
          logger.warn(err);
        }
      });

      cbEssaim();
    }, (err) => {
      if (err) {
        console.warn(err);
        logger.warn(err);
      }
    });

    cbDeviceList();
  }, (err) => {
    if (err) {
      console.warn(err);
      logger.warn(err);
    }

    next();
  });

};

/**
 *
 */
export class LinkDevice {
  /**
   *
   * @param {Object} data
   * @param {socket.io} socket
   * @param {Function} callback
   */
  constructor(data, socket, callback) {
    this._queue = new Queue(adapters.getAdapter('queue'), data['application']['businessId']);
    this._socket = socket;
    this._data = data;
    this._send = null;

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    class Starter {
      constructor() {

      }
      static master(context, callback) {
        context.registerMaster(callback);
      }
      static manager(context, callback) {
        context.registerManager(callback);
      }
      static slave(context, callback) {
        context.registerSlave(callback);
      }
    }

    try {
      Starter[data.device.role](this, callback);
    } catch (e) {
      console.warn(new Error(`The property: ${data.device.role}, not exist: ${e}`));
      logger.warn(new Error(`The property: ${data.device.role}, not exist: ${e}`));
    }
  }

  /**
   *
   * @param {Function} next
   */
  createIfNotExistListDevices(next) {
    if (!devicesContainer.hasOwnProperty(`${this._data.device.role}s`)) {
      return next(new Error(`The container don't contain a object: ${this._data.device.role}s`));
    }
    if (!devicesContainer[`${this._data.device.role}s`].hasOwnProperty(`${this._data['application']['businessId']}`)) {
      devicesContainer[`${this._data.device.role}s`][`${this._data['application']['businessId']}`] = {};
      return next();
    }
    if (devicesContainer[`${this._data.device.role}s`][this._data['application']['businessId']].hasOwnProperty(this._data['device']['macAddress'])) {
      return next(new Error(`The queue: ${this._data['device']['role']}, still contain a key: ${this._data['device']['macAddress']}`));
    }
    next();
  }

  /**
   *
   * @param {Object} data
   * @returns {Object}
   */
  createFakeList(data) {
    let fakeList = {};
    fakeList[`${data['application']['businessId']}`] = {};
    fakeList[`${data['application']['businessId']}`][`${data['device']['macAddress']}`] = this;

    return fakeList;
  }

  /**
   *
   * @param {Function} next
   */
  registerMaster(next) {
    this.createIfNotExistListDevices((err) => {
      if (err) {
        return next(err);
      }

      devicesContainer.masters[`${this._data['application']['businessId']}`][`${this._data['device']['macAddress']}`] = this;

      this.createSubQueue(`pubsub`, this._data['application']['businessId'], this.createFakeList(this._data), () => {
        logger.info(`${this._data['device']['macAddress']} has been added to the SubPub queue of the essaim ${this._data['application']['businessId']}`);
        this._queue.registerSelectorQueue(`topic`, (callback) => {
          this._send = callback;
          this._socket.on('message', (chunk) => {
            let { key, message } = JSON.parse(chunk);
            if (message) {
              return callback(message, key);
            }
            return callback(chunk);
          });
          next(null, this._data['device'], devicesContainer.slaves[`${this._data['application']['businessId']}`] || {});
        });
      });

    });

  }

  /**
   *
   * @param {Function} next
   */
  registerManager(next) {
    this.createIfNotExistListDevices((err) => {
      if (err) {
        return next(err);
      }

      devicesContainer.managers[`${this._data['application']['businessId']}`][`${this._data['device']['macAddress']}`] = this;

      this.createSubQueue(`pubsub`, this._data['application']['businessId'], this.createFakeList(this._data), () => {
        logger.info(`${this._data['device']['macAddress']} has been added to the SubPub queue of the essaim ${this._data['application']['businessId']}`);
        this._queue.registerSelectorQueue(`topic`, (callback) => {
          this._send = callback;
          this._socket.on('message', (chunk) => {
            let { key, message } = JSON.parse(chunk);
            if (message) {
              return callback(message, key);
            }
            return callback(chunk);
          });
          next(null, this._data['device'], devicesContainer.slaves[`${this._data['application']['businessId']}`] || {});
        });
      });
    });
  }

  /**
   *
   * @param {Function} next
   */
  registerSlave(next) {
    this.createIfNotExistListDevices((err) => {
      if (err) {
        return next(err);
      }

      devicesContainer.slaves[`${this._data['application']['businessId']}`][`${this._data['device']['macAddress']}`] = this;

      this.createTopicQueue(`topic`, this._data['application']['businessId'], this._data['device']['macAddress'], this.createFakeList(this._data), () => {
        logger.info(`${this._data['device']['macAddress']} has been added to the Topic queue of the essaim ${this._data['application']['businessId']}`);
        this._queue.registerPubQueue(`pubsub`, (callback) => {
          this._send = callback;
          callback(JSON.stringify({
            type: 'service', message: {
              action: 'connection',
              content: { role: 'slave', status: 'connected', id: this._data['device']['macAddress'] },
              time: new Date()
            }
          }));
          this._socket.on('message', (message) => {
            let messageObj = JSON.parse(message);
            messageObj.slaveId = this._data['device']['macAddress'];
            callback(JSON.stringify(messageObj));
          });
          next(null, this._data['device']);
        });
      });

    });
  }

  /**
   *
   * @param {String} queue
   * @param {String} essaim
   * @param {Object} list
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
        if (!message) {
          return;
        }
        logger.info('subQueue message: ' + message.content.toString());
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
   * @param {Object} list
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
        if (!message) {
          return;
        }
        logger.info('topicQueue message: ' + message.content.toString());
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
    logger.info(`action: ${action}`);

    //if (!this.hasOwnProperty(action)) {
    //  throw new Error(`The property: ${action}, not exist`);
    //}
    try {
      this[action](done);
    } catch (e) {
      console.warn(new Error(`The property: ${action}, not exist: ${e}`));
      logger.warn(new Error(`The property: ${action}, not exist: ${e}`));
    }
  }

  /**
   *
   * @param {Function} done
   * @returns {*}
   */
  deleteDevice(done) {
    done = "function" === typeof done ? done : (value) => {
      return value;
    };
    if (!devicesContainer.hasOwnProperty(`${this._data.device.role}s`)) {
      throw new Error(`The deviceContainer don't contain a container: ${this._data.device.role}s`);
    }
    if (!devicesContainer[`${this._data.device.role}s`][this._data['application']['businessId']] || !devicesContainer[`${this._data.device.role}s`][this._data['application']['businessId']][this._data['device']['macAddress']]) {
      return done(new Error('Nothing to do'));
    }
    delete(devicesContainer[`${this._data.device.role}s`][this._data['application']['businessId']][this._data['device']['macAddress']]);
    logger.info(`device: ${[this._data['device']['macAddress']]}, has been removed from: ${this._data['application']['businessId']}`);
    return done();
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromMaster(done) {
    this._queue.close(`pubsub`, '', () => {
      logger.info(`queue for master: ${this._data['device']['macAddress']}, has been unbinded`);
      this.deleteDevice(done);
    });
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromManager(done) {
    this._queue.close(`pubsub`, this._data['device']['macAddress'], () => {
      logger.info(`queue for manager: ${this._data['device']['macAddress']}, has been unbinded`);
      this.deleteDevice(done);
    });
  }

  /**
   *
   * @param {Function} done
   */
  disconnectFromSlave(done) {
    let beforeClose = () => {
      logger.info(`queue for slave ${this._data['device']['macAddress']}, is going to be removed from masters and managers`);
      this._queue.close(`topic`, this._data['device']['macAddress'], () => {
        logger.info(`queue for slave: ${this._data['device']['macAddress']}, has been unbinded`);
        this.deleteDevice(done);
      });
    };

    //let timeout = 20;
    //let interval = setInterval(() => {

    //logger.info('click');

    if (this._send) {
      //stopFunction();
      return this._send(JSON.stringify({
        type: 'service', message: {
          action: 'slaveDisconnected',
          content: { role: 'slave', status: 'disconnected', id: this._data['device']['macAddress'] },
          time: new Date()
        }
      }), () => {
        setTimeout(beforeClose, 1000);
      });
    }

    return beforeClose();
    //if (--timeout < 1) {
    //  stopFunction();
    //  return done();
    //}
    //}, 1000);

    //function stopFunction() {
    //  clearInterval(interval);
    //}
  }

  /**
   * Return socket
   * @returns {socket.io}
   */
  get socket() {
    return this._socket;
  }

}

