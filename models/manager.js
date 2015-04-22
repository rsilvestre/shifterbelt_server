"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by michaelsilvestre on 20/04/15
 */

var _Device2 = require("./device.js");

var _Device3 = _interopRequireWildcard(_Device2);

var _modelManager = require("../lib/model-manager.js");

var Manager = (function (_Device) {
    function Manager(macAddress) {
        _classCallCheck(this, Manager);

        _get(Object.getPrototypeOf(Manager.prototype), "constructor", this).call(this, macAddress);
    }

    _inherits(Manager, _Device);

    return Manager;
})(_Device3["default"]);

exports["default"] = Manager;

_modelManager.modelManager.model("Manager", Manager);
module.exports = exports["default"];

//# sourceMappingURL=manager.js.map