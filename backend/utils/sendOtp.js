import transporter from "../config/mailerConfig.js";
import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";

export const sendOtpEmail = async (email) => {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // console.log(email);
    console.log(otp);

    const otpExist = await OTP.findOne({ email });
    if (otpExist) {
      otpExist.otp = otp;
      otpExist.createdAt = Date.now();
      await otpExist.save();
    } else {
      const newOtp = new OTP({ email, otp });
      await newOtp.save();
    }

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return "OTP sent successfully";
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};
