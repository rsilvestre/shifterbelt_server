/**
 * Created by michaelsilvestre on 4/06/15
 */

/**
 * Module dependencies.
 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _libUtils = require('../lib/utils');

var _libUtils2 = _interopRequireDefault(_libUtils);

var _utilsCountriesJson = require('../utils/countries.json');

var _utilsCountriesJson2 = _interopRequireDefault(_utilsCountriesJson);

var Schema = _mongoose2['default'].Schema;

var countryValidator = function countryValidator(countryCode) {
  'use strict';

  return ~_libUtils2['default'].indexof(_utilsCountriesJson2['default'], { code: countryCode });
};

var PlanSchema = new Schema({
  tariffPlan: { type: Schema.ObjectId, ref: 'Tariff', required: true },
  firstname: { type: String, required: 'The firstname should be filled' },
  lastname: { type: String, required: 'The lastname should be filled' },
  address: {
    address1: { type: String, required: 'An address should be given' },
    address2: { type: String },
    country: { type: String, required: 'A country should be selected', validate: countryValidator },
    zipcode: { type: String, required: 'A zip code should be given' },
    city: { type: String, required: 'The city should be filled' },
    phonenumber: { type: String, required: 'The phone number should be filled' }
  },
  createdAt: { type: Date, 'default': Date.now }

});

/**
 * Virtals
 */
PlanSchema.virtual('address1').set(function (value) {
  this.address.address1 = value;
}).get(function () {
  'use strict';
  return this.address.address1;
});

PlanSchema.virtual('address2').set(function (value) {
  this.address.address2 = value;
}).get(function () {
  'use strict';
  return this.address.address2;
});

PlanSchema.virtual('country').set(function (value) {
  this.address.country = value;
}).get(function () {
  'use strict';
  return this.address.country;
});

PlanSchema.virtual('zipcode').set(function (value) {
  this.address.zipcode = value;
}).get(function () {
  'use strict';
  return this.address.zipcode;
});

PlanSchema.virtual('city').set(function (value) {
  this.address.city = value;
}).get(function () {
  'use strict';
  return this.address.city;
});

PlanSchema.virtual('phonenumber').set(function (value) {
  this.address.phonenumber = value;
}).get(function () {
  'use strict';
  return this.address.phonenumber;
});

_mongoose2['default'].model('Plan', PlanSchema);

//# sourceMappingURL=plan.js.map