/**
 * Created by michaelsilvestre on 24/04/15
 */

import mongoose from "mongoose";

let deviceSchema = mongoose.Schema({
  macAddress: {
    type: String,
    required: 'macAddress is required',
    unique: true,
    trim: true,
    validate: [(value) => {
      return /[a-z0-9]{12}/.test(value);
    }, "Invalid Mac Address"],
    match: [/[a-z0-9]{12}/, "Please fill a valid Mac Address"]
  },
  applications: [{
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    active: { type: Boolean, required: true },
    role: { type: String, required: true, enum: ["master", "manager", "slave"] }
  }],
  createdAt: { type: Date, default: Date.now }
});

deviceSchema.index({ macAddress: 1 });

export let Device = mongoose.model('Device', deviceSchema);

Device.schema.path('macAddress').validate();

Device.schema.path('applications').validate((value) => {
  value.forEach((application) => {
    if (!/master|manager|slave/.test(application.role)) {
      return false;
    }
  });
  return true;
}, "Invalid application role");