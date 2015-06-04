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

  run(server) {
    let App = require(`${config.root}/app.js`);
    new adapters[config.adapters.getAdapter("database")](function() {
      new adapters[config.adapters.getAdapter("memory")](function() {
        new adapters[config.adapters.getAdapter("queue")](function() {
          new adapters[config.adapters.getAdapter("websocket")](server, function() {
          });
        })
      });
    });


    //websocket.io.listen(server);
    /*
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
     .then((x) => {
     x.io.listen(server);
     let app = new App();
     });
     */
  }
}
