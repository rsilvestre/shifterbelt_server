/**
 * Created by michaelsilvestre on 19/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _mssql = require("mssql");

var _mssql2 = _interopRequireDefault(_mssql);

var _configConfigJs = require("../config/config.js");

var config = _interopRequireWildcard(_configConfigJs);

var _absAdapterJs = require("./absAdapter.js");

var _absAdapterJs2 = _interopRequireDefault(_absAdapterJs);

var _libLoggerJs = require("../lib/logger.js");

var MssqlAdapter = (function (_AbsAdapter) {
    function MssqlAdapter(callback) {
        _classCallCheck(this, MssqlAdapter);

        _get(Object.getPrototypeOf(MssqlAdapter.prototype), "constructor", this).call(this, "database");

        this.init(callback);
    }

    _inherits(MssqlAdapter, _AbsAdapter);

    _createClass(MssqlAdapter, [{
        key: "init",
        value: function init(callback) {
            var _this = this;

            var mssqlConfig = config.adapters.getConfig("database");
            this._connection = _mssql2["default"].connect(mssqlConfig, function (err) {
                if (err) throw err;
                _this._mssql = _mssql2["default"];
                _libLoggerJs.logger.info("mssql successfull connected");
                callback(_this);
            });
        }
    }, {
        key: "connection",
        get: function () {
            return this._connection;
        }
    }, {
        key: "mssql",
        get: function () {
            return this._mssql;
        }
    }]);

    return MssqlAdapter;
})(_absAdapterJs2["default"]);

exports["default"] = MssqlAdapter;
module.exports = exports["default"];

//# sourceMappingURL=mssql-adapter.js.map