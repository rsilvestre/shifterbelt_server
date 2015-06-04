/**
 * Created by michaelsilvestre on 19/04/15
 */

import Bootstrap from "./config/bootstrap.js"
import Logger from "./lib/logger.js"
import * as logConfig from "./config/logs.js"
import sticky from 'socketio-sticky-session'

let logger = new Logger();
logger.init(logConfig.config.logLevel, logConfig.config.path);

sticky({num: 1}, function() {
  let http = require('http');
  let server = http.createServer(function(req, res){
    let toto = "";
  });
  let bootstrap = new Bootstrap();
  bootstrap.run(server);
  return server;
}).listen(3000, function(){
  console.log('Server started on port 3000');
});

//import Identify from './lib/identify.js'

/*let identify = new Identify();
 identify.user((err, result) => {
 if (err) throw err;
 console.log(result);
 });*/
//let app = App();
