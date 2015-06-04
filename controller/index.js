/**
 * Created by michaelsilvestre on 25/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _identifyJs = require("./identify.js");

var _authenticateJs = require("./authenticate.js");

var Controller = function Controller() {
  _classCallCheck(this, Controller);

  (0, _identifyJs.identityInit)();
  (0, _authenticateJs.authenticateInit)();
};

exports["default"] = Controller;
module.exports = exports["default"];

//# sourceMappingURL=index.js.map