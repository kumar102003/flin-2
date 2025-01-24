const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  firstName: { type: String, required: true }, // Fixed typo
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Fixed 'unique: true' for password, which is unnecessary
  files: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  isSubscribed: { type: Boolean, default: false },
});


module.exports = mongoose.model("User", userSchema);
