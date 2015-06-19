/**
 * Created by michaelsilvestre on 19/04/15
 */

import Bootstrap from "./config/bootstrap.js"
import Logger from "./lib/logger.js"
import * as logConfig from "./config/logs.js"

let logger = new Logger();
logger.init(logConfig.config.logLevel, logConfig.config.path);

try {
  let bootstrap = new Bootstrap();
  bootstrap.run();
} catch (e) {
  logger.info = e;
}
//import Identify from './lib/identify.js'

/*let identify = new Identify();
 identify.user((err, result) => {
 if (err) throw err;
 console.log(result);
 logger.info(result);
 });*/
//let app = App();
