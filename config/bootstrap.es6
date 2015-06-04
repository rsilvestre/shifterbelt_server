/**
 * Created by michaelsilvestre on 19/04/15
 */

import config from "./config.js"
import adapters from "../adapters/index.js"
import fs from 'fs'

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
    fs.readdirSync(`${config.root}/models`).forEach(function(file) {
      if (/\.js$/.test(file)) {
        require(`${config.root}/models/${file}`);
      }
    });
  }

  run() {
    let App = require(`${config.root}/app.js`);
    var p = dbloader("database")
      .then(()=> {
        return dbloader("memory");
      })
      .then(() => {
        return dbloader("queue");
      })
      .then(() => {
        return dbloader("websocket");
      })
      .then(() => {

        let app = new App();

      });
  }
}
