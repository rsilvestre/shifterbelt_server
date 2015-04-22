"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by michaelsilvestre on 19/04/15
 */

var _import = require("../adapters/index.js");

var adapters = _interopRequireWildcard(_import);

var _import2 = require("../config/adapters.js");

var config = _interopRequireWildcard(_import2);

var _socketIo = require("socket.io");

var _socketIo2 = _interopRequireWildcard(_socketIo);

function getAdapter(name) {
    return config.adapters[name];
}

function dbloader(key) {
    var name = config.adapters.getAdapter(key);
    return new Promise(function (resolve, reject) {
        new adapters.adapters[name](resolve);
    });
}

var Bootstrap = (function () {
    function Bootstrap(callback) {
        _classCallCheck(this, Bootstrap);

        this._application = callback;
    }

    _createClass(Bootstrap, [{
        key: "run",
        value: function run() {
            var _this = this;

            var p = dbloader("database").then(function () {
                return dbloader("memory");
            }).then(function () {
                return dbloader("queue");
            }).then(function () {
                return dbloader("websocket");
            }).then(function () {

                var app = new _this._application();
            });
        }
    }]);

    return Bootstrap;
})();

exports["default"] = Bootstrap;
module.exports = exports["default"];

//# sourceMappingURL=bootstrap.js.map