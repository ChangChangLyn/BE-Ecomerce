const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const EmailService = require("../services/EmailService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "OK",
          message: "The email is already",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "Success",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const forgotPassword = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      user.otp = otp;
      await user.save();

      await EmailService.sendEmailOTP(email, otp);
      resolve({
        status: "OK",
        message: "Success",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const vetifyOTP = (email, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return reject({
          status: 400,
          message: "User not found",
        });
      }

      if (user.otp !== otp) {
        return reject({
          status: 400,
          message: "Invalid OTP",
        });
      }
      user.otp = null;
      await user.save();

      resolve({
        status: 200,
        message: "OTP verified successfully",
      });
    } catch (e) {
      console.error("Error in vetifyOTP service:", e);
      reject({
        status: 500,
        message: "An error occurred: " + e.message,
      });
    }
  });
};
const resetPassword = (resetPass) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = resetPass;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        resolve({
          status: "ERR",
          message: "The email is not defined",
        });
      }
      const hash = bcrypt.hashSync(password, 10);

      const reset = await User.findOneAndUpdate(
        { email: email },
        { password: hash },
        { new: true }
      );

      if (reset) {
        resolve({
          status: "OK",
          message: "Đặt lại mật khẩu thành công",
          data: reset,
        });
      }
    } catch (error) {
      console.error("Lỗi trong dịch vụ resetPassword:", error);
      reject({
        status: "ERR",
        message: "Đã xảy ra lỗi khi đặt lại mật khẩu",
      });
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "Success",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "Success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  forgotPassword,
  vetifyOTP,
  resetPassword,
};
