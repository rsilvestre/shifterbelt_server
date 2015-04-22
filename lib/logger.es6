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
export var log = null;

export let logger = {
    error: (value) => {
        if (log instanceof Logger) {
            log.error(value);
        }
    },
    debug: (value) => {
        if (log instanceof Logger) {
            log.debug(value);
        }
    },
    info: (value) => {
        if (log instanceof Logger) {
            log.info(value);
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
        log = new Log(logLevel, fs.createWriteStream(`${appRootPath}/log/${logFile}`));
    }

    set error(value) {
        log.error(value);
    }

    set debug(value) {
        log.debug(value);
    }

    set info(value) {
        log.info(value);
    }
}