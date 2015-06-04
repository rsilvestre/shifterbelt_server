/**
 * Created by michaelsilvestre on 24/04/15
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var deviceSchema = _mongoose2["default"].Schema({
    macAddress: {
        type: String,
        required: "macAddress is required",
        unique: true,
        trim: true,
        validate: [function (value) {
            return /[a-z0-9]{12}/.test(value);
        }, "Invalid Mac Address"],
        match: [/[a-z0-9]{12}/, "Please fill a valid Mac Address"]
    },
    applications: [{
        applicationId: { type: _mongoose2["default"].Schema.Types.ObjectId, ref: "Application", required: true },
        active: { type: Boolean, required: true },
        role: { type: String, required: true, "enum": ["master", "manager", "slave"] }
    }],
    createdAt: { type: Date, "default": Date.now }
});

deviceSchema.index({ macAddress: 1 });

var Device = _mongoose2["default"].model("Device", deviceSchema);

exports.Device = Device;
Device.schema.path("macAddress").validate();

Device.schema.path("applications").validate(function (value) {
    value.forEach(function (application) {
        if (!/master|manager|slave/.test(application.role)) {
            return false;
        }
    });
    return true;
}, "Invalid application role");

//# sourceMappingURL=device.js.map