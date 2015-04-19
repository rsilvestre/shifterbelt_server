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

var _redis = require("redis");

var _redis2 = _interopRequireWildcard(_redis);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireWildcard(_AbsAdapter2);

var _url = require("url");

var _url2 = _interopRequireWildcard(_url);

var RedisAdapter = (function (_AbsAdapter) {
    function RedisAdapter(callback) {
        _classCallCheck(this, RedisAdapter);

        _get(Object.getPrototypeOf(RedisAdapter.prototype), "constructor", this).call(this, "memory");
        this.init();
        console.log("redis successfull connected");
        callback(this);
    }

    _inherits(RedisAdapter, _AbsAdapter);

    _createClass(RedisAdapter, [{
        key: "init",
        value: function init() {
            var redisConfig = config.adapters.getConfig("memory");
            var redisURL = _url2["default"].parse(redisConfig.defaultUrl());

            this._redisClient = _redis2["default"].createClient(redisURL.port, redisURL.hostname, { no_ready_check: true });

            if (redisURL.auth) {
                this._redisClient.auth(redisURL.auth.split(":")[1]);
            }

            this._redisClient.on("error", function (err) {
                "use strict";

                console.log("Error " + err);
                log.info("Error " + err);
            });
        }
    }, {
        key: "client",
        get: function () {
            return this._redisClient;
        }
    }]);

    return RedisAdapter;
})(_AbsAdapter3["default"]);

exports["default"] = RedisAdapter;
module.exports = exports["default"];

//# sourceMappingURL=redis-adapter.js.map