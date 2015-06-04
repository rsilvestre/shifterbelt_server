/**
 * Created by michaelsilvestre on 4/06/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _adaptersJs = require("./adapters.js");

var adapters = _interopRequireWildcard(_adaptersJs);

exports["default"] = {
  root: "" + __dirname + "/..",
  adapters: adapters
};
module.exports = exports["default"];

//# sourceMappingURL=config.js.map