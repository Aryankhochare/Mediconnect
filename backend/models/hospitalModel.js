const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"], // used for authentication (similar to doctor)
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Hospital name is required"],
  },
  address: {
    type: String,
    required: [true, "Hospital address is required"],
  },
  phone: {
    type: String,
    required: [true, "Hospital phone number is required"],
  },
  email: {
    type: String,
    required: [true, "Hospital email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  departments: [
    {
      type: String,
      required: true,
    },
  ],
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctors",
    },
  ],
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const hospitalModel = mongoose.model("hospitals", hospitalSchema);

module.exports = hospitalModel;
