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
 * Created by michaelsilvestre on 19/04/15
 */

var _rabbit = require("rabbit.js");

var _rabbit2 = _interopRequireWildcard(_rabbit);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireWildcard(_AbsAdapter2);

var RabbitAdapter = (function (_AbsAdapter) {
    function RabbitAdapter(callback) {
        _classCallCheck(this, RabbitAdapter);

        _get(Object.getPrototypeOf(RabbitAdapter.prototype), "constructor", this).call(this, "queue");
        this._pub = null;
        this._sub = null;

        this.init(callback);
    }

    _inherits(RabbitAdapter, _AbsAdapter);

    _createClass(RabbitAdapter, [{
        key: "init",
        value: function init(callback) {
            var _this = this;

            var rabbitConfig = config.adapters.getConfig("queue");

            this._context = require("rabbit.js").createContext(rabbitConfig.url);
            this._context.on("ready", function () {
                "use strict";

                console.log("rabbit successfull connected");
                _this._pub = _this._context.socket("PUB");
                _this._sub = _this._context.socket("SUB");
                //sub.pipe(process.stdout);
                _this._sub.setEncoding("utf8");
                _this._sub.on("data", function (note) {
                    "use strict";

                    console.log("Alarum! %s", note);
                    log.info("Alarum! %s", note);
                });

                _this._sub.connect("events", function () {
                    "use strict";

                    _this._pub.connect("events");
                });
                callback(_this);
            });
        }
    }, {
        key: "rabbit",
        get: function () {
            return this._context;
        }
    }]);

    return RabbitAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = RabbitAdapter;
module.exports = exports["default"];

//# sourceMappingURL=rabbitmq-adapter.js.map