/**
 * Created by michaelsilvestre on 24/04/15
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;

var validateEmail = function validateEmail(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var userSchema = _mongoose2['default'].Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  name: { type: String, 'default': '' },
  username: { type: String, 'default': '' },
  provider: { type: String, 'default': '' },
  tariffPlan: { type: String, 'default': '', 'enum': ['', 'plan1', 'plan2', 'plan3', 'plan4', 'plan5', 'custom'] },
  hashed_password: { type: String, 'default': '' },
  salt: { type: String, 'default': '' },
  authToken: { type: String, 'default': '' },
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {},
  applications: [{ applicationId: { type: _mongoose2['default'].Schema.ObjectId, ref: 'Application' } }],
  firstname: { type: String },
  lastname: { type: String },
  phonenumber: { type: String },
  addresses: [{
    typeAddress: { type: String },
    street: { type: String },
    number: { type: String },
    town: { type: String },
    postcode: { type: String },
    country: { type: String },
    createdAt: { type: Date, 'default': Date.now }
  }],
  tariff: {
    tariffId: { type: Schema.ObjectId, ref: 'Tariff' }
  },
  createdAt: { type: Date, 'default': Date.now }
});

userSchema.index({ email: 1 });

var User = _mongoose2['default'].model('User', userSchema);
exports.User = User;

//# sourceMappingURL=user.js.map