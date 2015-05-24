"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function(obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);
    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }
  return obj;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by michaelsilvestre on 23/04/15
 */

var _applicationJs = require("./application.js");

_defaults(exports, _interopRequireWildcard(_applicationJs));

var _deviceJs = require("./device.js");

_defaults(exports, _interopRequireWildcard(_deviceJs));

var _userJs = require("./user.js");

_defaults(exports, _interopRequireWildcard(_userJs));

//# sourceMappingURL=index.js.map