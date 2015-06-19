/**
 * Created by michaelsilvestre on 20/04/15
 */

/**
 * 0 EMERGENCY system is unusable
 * 1 ALERT action must be taken immediately
 * 2 CRITICAL the system is in critical condition
 * 3 ERROR error condition
 * 4 WARNING warning condition
 * 5 NOTICE a normal but significant condition
 * 6 INFO a purely informational message
 * 7 DEBUG messages to debug an application
 */

import Log from "log"
import fs from "fs"
import appRootPath from "app-root-path"
import logentries from 'node-logentries';
import config from '../config/config'
export var log = null;

export let logger = {
  error: (value) => {
    if (log instanceof Logger) {
      log.error = value;
    }
  },
  debug: (value) => {
    if (log instanceof Logger) {
      log.debug = value;
    }
  },
  notice: (value) => {
    if (log instanceof Logger) {
      log.notice = value;
    }
  },
  warn: (value) => {
    if (log instanceof Logger) {
      log.warning = value;
    }
  },
  info: (value) => {
    if (log instanceof Logger) {
      log.info = value;
    }
  }
};

export default class Logger {
  constructor() {
  }

  init(logLevel, logFile) {
    if (["error", "debug", "info"].indexOf(logLevel) == -1) {
      return new Error(`The log level: ${logLevel}, not exist`);
    }
    //log = new Log(logLevel, fs.createWriteStream(`${appRootPath}/log/${logFile}`));
    this._log = logentries.logger({
      token: config.logentries_token
    });
    log = this;
  }

  set error(value) {
    console.error(value);
    this._log.error(value);
  }

  set debug(value) {
    console.log(value);
    this._log.debug(value);
  }

  set warning(value) {
    console.warn(value);
    this._log.warning(value);
  }

  set notice(value) {
    console.log(value);
    this._log.notice(value);
  }

  set info(value) {
    console.info(value);
    this._log.info(value);
  }
}