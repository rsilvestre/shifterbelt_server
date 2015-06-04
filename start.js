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

var _socketioStickySession = require("socketio-sticky-session");

var _socketioStickySession2 = _interopRequireDefault(_socketioStickySession);

var logger = new _libLoggerJs2["default"]();
logger.init(logConfig.config.logLevel, logConfig.config.path);

(0, _socketioStickySession2["default"])({ num: 1 }, function () {
  var http = require("http");
  var server = http.createServer(function (req, res) {
    var toto = "";
    res.writeHead(200, { 'Content-Type': 'text/plain',
      'Trailer': 'Content-MD5' });
    res.write("Thank you");
    res.end();
  });
  var bootstrap = new _configBootstrapJs2["default"]();
  bootstrap.run(server);
  return server;
}).listen(3000, function () {
  console.log("Server started on port 3000");
});

//import Identify from './lib/identify.js'

/*let identify = new Identify();
 identify.user((err, result) => {
 if (err) throw err;
 console.log(result);
 });*/
//let app = App();

//# sourceMappingURL=start.js.map