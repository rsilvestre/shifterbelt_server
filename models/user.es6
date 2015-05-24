/**
 * Created by michaelsilvestre on 24/04/15
 */

import mongoose from "mongoose";

let validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

let userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phonenumber: { type: String },
  addresses: [{
    street: { type: String, required: true },
    number: { type: String, required: true },
    town: { type: String, required: true },
    postcode: { type: String, required: true },
    country: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });

export let User = mongoose.model('User', userSchema);

