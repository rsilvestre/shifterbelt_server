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
 * Created by michaelsilvestre on 20/04/15
 */

var _amqp = require("amqp");

var _amqp2 = _interopRequireWildcard(_amqp);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireWildcard(_AbsAdapter2);

var AmqpAdapter = (function (_AbsAdapter) {
    function AmqpAdapter(callback) {
        _classCallCheck(this, AmqpAdapter);

        _get(Object.getPrototypeOf(AmqpAdapter.prototype), "constructor", this).call(this, "queue");

        this.init(callback);
    }

    _inherits(AmqpAdapter, _AbsAdapter);

    _createClass(AmqpAdapter, [{
        key: "init",
        value: function init(callback) {
            var _this = this;

            var amqpConfig = config.adapters.getConfig("queue");

            this._connection = _amqp2["default"].createConnection(amqpConfig);
            this._connection.on("ready", function () {
                console.log("amqp successfull connected");
                callback(_this);
            });
        }
    }, {
        key: "connection",
        get: function () {
            return this._connection;
        }
    }]);

    return AmqpAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = AmqpAdapter;
module.exports = exports["default"];

//# sourceMappingURL=amqp-adapter.js.map