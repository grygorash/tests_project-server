const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  by_father: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  permission: { type: Number, required: true },
  created_date: { type: Date, default: Date.now },
  active: { type: Boolean, default: false },
  reset_password_token: String,
  reset_password_expire: Date,
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.matchPasswords = async function(password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function(expire) {
  return sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: expire },
  );
};

UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.reset_password_token = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.reset_password_expire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
