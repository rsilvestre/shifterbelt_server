"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by michaelsilvestre on 22/04/15
 */

var _socketIo = require("socket.io");

var _socketIo2 = _interopRequireWildcard(_socketIo);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireWildcard(_AbsAdapter2);

var WebsocketAdapter = (function (_AbsAdapter) {
    function WebsocketAdapter(callback) {
        _classCallCheck(this, WebsocketAdapter);

        _get(Object.getPrototypeOf(WebsocketAdapter.prototype), "constructor", this).call(this, "websocket");

        this.init(callback);
    }

    _inherits(WebsocketAdapter, _AbsAdapter);

    _createClass(WebsocketAdapter, [{
        key: "init",
        value: function init(callback) {
            var websocketConfig = config.adapters.getConfig("websocket");
            this._io = _socketIo2["default"](websocketConfig.port);
            this._nsp = this._io.of(websocketConfig.namespace);
            console.log("socket.io successfull connected");
            callback(this);
        }
    }, {
        key: "io",
        get: function () {
            return this._io;
        }
    }, {
        key: "connection",
        value: function connection(callback) {
            this._nsp.on("connection", callback);
        }
    }]);

    return WebsocketAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = WebsocketAdapter;
module.exports = exports["default"];

//# sourceMappingURL=websocket-adapter.js.map