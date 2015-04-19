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

var _mssql = require("mssql");

var _mssql2 = _interopRequireWildcard(_mssql);

var _import = require("../config/adapters.js");

var config = _interopRequireWildcard(_import);

var _AbsAdapter2 = require("./absAdapter.js");

var _AbsAdapter3 = _interopRequireWildcard(_AbsAdapter2);

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
                console.log("mssql successfull connected");
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
})(_AbsAdapter3["default"]);

exports["default"] = MssqlAdapter;
module.exports = exports["default"];

//# sourceMappingURL=mssql-adapter.js.map