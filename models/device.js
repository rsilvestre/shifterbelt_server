"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by michaelsilvestre on 20/04/15
 */

var Device = (function () {
    function Device(macAddress) {
        _classCallCheck(this, Device);

        this._macAddress = macAddress;
    }

    _createClass(Device, [{
        key: "macAddress",
        get: function () {
            return this._macAddress;
        }
    }, {
        key: "application",
        set: function (value) {
            this._application = value;
        },
        get: function () {
            return this._application;
        }
    }, {
        key: "password",
        set: function (value) {
            this._password = value;
        },
        get: function () {
            return this._password;
        }
    }, {
        key: "keyName",
        set: function (value) {
            this._keyName = value;
        },
        get: function () {
            return this._keyName;
        }
    }]);

    return Device;
})();

exports["default"] = Device;
module.exports = exports["default"];

//# sourceMappingURL=device.js.map