/**
 * Created by michaelsilvestre on 30/05/15
 */

import mongoose from "mongoose"
import getmac from "getmac"
import { logger } from "../lib/logger.js"

import _ from "underscore"

let Application = mongoose.model('Application');

export default class Authentication {
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
      if (null === result.device.role || result.device.role.length === 0 || result.device.role === "") {
        return callback(new Error("The key and password are not correct"), null);
      }
      console.log(result);
      logger.info(result);
      return callback(null, result);
    });
  }
}
