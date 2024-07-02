import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120 }
});

otpSchema.pre('save', async function(next) {
  if (!this.isModified('otp')) {
      return next();
  }
  
  try {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt);
      next();
  } catch (err) {
      next(err);
  }
});

otpSchema.methods.verifyOtp = async function(userOtp) {
  return await bcrypt.compare(userOtp, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
