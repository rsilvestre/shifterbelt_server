/**
 * Created by michaelsilvestre on 19/04/15
 */

"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _configBootstrapJs = require("./config/bootstrap.js");

var _configBootstrapJs2 = _interopRequireDefault(_configBootstrapJs);

var _libLoggerJs = require("./lib/logger.js");

var _libLoggerJs2 = _interopRequireDefault(_libLoggerJs);

var _configLogsJs = require("./config/logs.js");

var logConfig = _interopRequireWildcard(_configLogsJs);

var logger = new _libLoggerJs2["default"]();
logger.init(logConfig.config.logLevel, logConfig.config.path);

try {
  var bootstrap = new _configBootstrapJs2["default"]();
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

//# sourceMappingURL=shifterbelt.js.map