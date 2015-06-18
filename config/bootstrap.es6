/**
 * Created by michaelsilvestre on 19/04/15
 */

import config from "./config.js"
import adapters from "../adapters/index.js"
import { logger } from "../lib/logger.js"
import fs from 'fs'
import async from 'async'

function getAdapter(name) {
  return adapters[name];
}

function dbloader(key) {
  let name = config.adapters.getAdapter(key);
  return new Promise((resolve, reject) => {
    new adapters[name](resolve);
  });
}

export default class Bootstrap {
  constructor(callback) {
    // Bootstrap models
    async.each(fs.readdirSync(`${config.root}/models`), function(file, callback) {
      if (/\.js$/.test(file)) {
        require(`${config.root}/models/${file}`);
      }
      callback()
    },(err) => {
      if (err) {
        logger.warn(err);
      }
    });
  }

  run() {
    let App = require(`${config.root}/app.js`);
    var p = dbloader("database")
      .then(()=> {
        logger.info('database loaded');
        return dbloader("memory");
      })
      .then(() => {
        logger.info('memory loaded');
        return dbloader("queue");
      })
      .then(() => {
        logger.info('queue loaded');
        return dbloader("websocket");
      })
      .then(() => {
        logger.info('websocket loaded');

        let app = new App();

      });
  }
}
