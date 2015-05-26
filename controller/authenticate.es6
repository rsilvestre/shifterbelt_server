/**
 * Created by michaelsilvestre on 25/04/15
 */

import { adapters } from "../adapters/absAdapter.js"
import { LinkDevice } from "./message.js"
import _ from "underscore"
import mongoose from "mongoose"
import getmac from "getmac"

let Application = mongoose.model('Application');

export let authenticateInit = () => {
  let websocketAdapter = adapters.getAdapter("websocket");
  websocketAdapter.connection(function(socket) {
    let device = null;
    console.log("a device is connected");
    socket.auth = false;
    //socket.emit('event', "first message");

    socket.on('authenticate', (data) => {
      let authenticate = new Authenticate(data);
      authenticate.checkAuthToken((err, success) => {
        if (err) {
          return socket.emit('error', err);
        }
        if (!success) {
          return;
        }
        device = success;
        console.log(`Authenticated socket: ${socket.id}`);
        socket.auth = true;

        _.each(websocketAdapter.io.nsps, (nsp) => {
          console.log(`restoring socket to: ${nsp.name}`);
          nsp.connected[socket.id] = socket;
        });


        let linkDevice = new LinkDevice(device, socket, (err, queue) => {
          if (err) {
            return console.warn(err);
          }
          queue.emit('authenticated');
          queue.emit('message', { event: "first server message" });
        });
        socket.on('disconnect', () => {
          linkDevice.disconnect();
        })
      });
    });

    socket.on('test', (message) => {
      console.log(message);
    });

    setTimeout(() => {
      if (!socket.auth) {
        console.log(`Disconnection socket: ${socket.id}`);
        socket.disconnect('unauthorized');
      }
    }, 1000);

    socket.on('disconnect', () => {
      console.log("a device is disconnected");
    })

  });
};

class Authenticate {
  constructor(data) {
    if (!data) {
      return null;
    }
    this._data = JSON.parse(data);
  }

  checkAuthToken(callback) {

    if (!this._data.hasOwnProperty('applicationId')) {
      return callback(new Error("Missing applicationId for the authentification"), null);
    }

    if (!this._data.hasOwnProperty('key')) {
      return callback(new Error("Missing key for the authentification"), null);
    }

    if (!this._data.hasOwnProperty('password')) {
      return callback(new Error("Missing password for the authentification"), null);
    }

    if (!this._data.hasOwnProperty('macAddress')) {
      return callback(new Error("Missing macAddress for the authentification"), null);
    }

    if (!_.isString(this._data['key'])) {
      return callback(new Error("Key should be a string"), null);
    }

    if (this._data['key'].length !== 40) {
      return callback(new Error("Key has not the good size"), null);
    }

    if (!_.isString(this._data['password'])) {
      return callback(new Error("Password should be a string"), null);
    }

    if (this._data['password'].length !== 80) {
      return callback(new Error("Password has not the good size"), null);
    }

    if (!_.isNumber(this._data['applicationId'])) {
      return callback(new Error("ApplicationId should be a number"), null);
    }

    if (!getmac.isMac(this._data['macAddress'])) {
      return callback(new Error("The mac address is not correctly formated"), null);
    }

    Application.authenticate(this._data, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (!result) {
        return callback(new Error("The applicationId are not correct"), null);
      }
      if (result.role === "") {
        return callback(new Error("The key and password are not correct"), null);
      }
      console.log(result);
      return callback(null, result);
    });
  }
}