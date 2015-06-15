/**
 * Created by michaelsilvestre on 25/04/15
 */

import { adapters } from "../adapters/absAdapter.js"
import { LinkDevice } from "../modules/message.js"
import Authentication from "../modules/authentication.js"
import { logger } from "../lib/logger.js"

import _ from "underscore"

export let authenticateInit = () => {
  let websocketAdapter = adapters.getAdapter("websocket");
  websocketAdapter.connection(function(socket) {
    let device = null;
    console.log("a device is connected");
    logger.info("a device is connected");
    socket.auth = false;
    //socket.emit('event', "first message");

    socket.on('authenticate', (data) => {
      let authentication = new Authentication(data);
      authentication.checkAuthToken((err, success) => {
        if (err) {
          return socket.emit('error_system', err.message);
        }
        if (!success) {
          return;
        }
        device = success;
        console.log(`Authenticated socket: ${socket.id}`);
        logger.info(`Authenticated socket: ${socket.id}`);
        socket.auth = true;

        _.each(websocketAdapter.io.nsps, (nsp) => {
          console.log(`restoring socket to: ${nsp.name}`);
          logger.info(`restoring socket to: ${nsp.name}`);
          nsp.connected[socket.id] = socket;
        });


        let linkDevice = new LinkDevice(device, socket, (err, device, slaves) => {
          if (err) {
            return console.warn(err);
          }
          socket.emit('authenticated');
          socket.emit('service', {
            action: 'identification',
            content: { role: device['role'], status: 'connected', id: device['macAddress'] },
            time: new Date()
          });
          socket.emit('message', { event: "first server message" });
          if (slaves) {
            socket.emit('service', {
              action: 'slaveList',
              content: Object.keys(slaves).map((value) => {
                return { role: 'slave', status: 'connected', id: value }
              }),
              time: new Date()
            });
          }
        });
        socket.on('disconnect', () => {
          linkDevice.disconnect((err) => {
            if (err) {
              console.log(err.message);
              return logger.info(err.message);
            }
            console.log('device disconnected, can be unlocked');
            logger.info('device disconnected, can be unlocked');
          });
        })
      });
    });

    socket.on('test', (message) => {
      console.log(message);
      logger.info(message);
    });

    setTimeout(() => {
      if (!socket.auth) {
        console.log(`Disconnection socket: ${socket.id}`);
        logger.info(`Disconnection socket: ${socket.id}`);
        socket.disconnect('unauthorized');
      }
    }, 1000);

    socket.on('disconnect', () => {
      console.log(`a device: ${socket.id}, is disconnected`);
      logger.info(`a device: ${socket.id}, is disconnected`);
    })

  });
};

