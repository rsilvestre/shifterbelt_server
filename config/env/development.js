/*!
 * Module dependencies.
 */

"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var fs = require("fs");
var envFile = "" + __dirname + "/env.json";

// Read env.json file, if it exists, load the id`s and secrets from that
// Note that this is only in the development env
// it is not safe to store id`s in files

if (fs.existsSync(envFile)) {
  var env = JSON.parse(fs.readFileSync(envFile, "utf-8"));
  _async2["default"].forEachOf(env, function (value, key, callback) {
    process.env[key] = value;
    callback();
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

/**
 * Expose
 */

module.exports = {
  baseUrl: "localhost:3000",
  db: process.env.MONGOHQ_URL,
  logLevel: "debug",
  path: "logger.log",
  logentries_token: process.env.LOGENTRIES_TOKEN,
  email: {
    noreply: {
      name: "Shifterbelt.com",
      email: "noreply@shifterbelt.com"
    }
  }
};

//# sourceMappingURL=development.js.map