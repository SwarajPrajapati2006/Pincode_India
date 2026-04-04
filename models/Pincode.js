const mongoose = require("mongoose");

// !! IMPORTANT !!
// The MongoDB collection has a data quality issue:
// "stateName" field has 39 trailing spaces in the key name itself.
// We define the schema with `strict: false` and handle this in the controller.

const pincodeSchema = new mongoose.Schema(
  {},
  {
    collection: "Pincodes",
    timestamps: false,
    versionKey: false,
    strict: false,
  }
);

// Create indexes on the commonly queried fields
pincodeSchema.index({ pincode: 1 });
pincodeSchema.index({ districtName: 1 });
pincodeSchema.index({ taluk: 1 });

module.exports = mongoose.model("Pincode", pincodeSchema);
