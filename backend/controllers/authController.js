const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const Email = require("../utils/handleEmail");
const crypto = require("crypto");

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = generateToken(newUser._id);

  const user = {
    name: newUser.name,
    email: newUser.email,
    _id: newUser._id,
  };

  res.status(200).json({
    status: "success",
    data: {
      user: user,
      token: token,
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the email and the password
  // if (!email || !password) {
  //   return next(new AppError("Email and Password are required!"), 400);
  // }

  if (!email || !password) {
    let message = {};

    if (!email) {
      message.email = "Email is required!";
    }

    if (!password) {
      message.password = "Password is required!";
    }

    return next(new AppError(JSON.stringify(message)), 400);
  }

  // Check if the user exists, and the password is correct
  const user = await User.findOne({ email: email });

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Email or password incorrect!", 400));
  }

  // Generate token, send it to the client
  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    data: {
      user: user,
      token: token,
    },
  });
});

// This receives the email address that the user provides from frontend
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // Get the user based on the email address that the user provides
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is not user with this email address", 404));
  }

  // If user exists, generate the token for password reset
  const resetToken = user.generateTokenForPasswordReset();
  await user.save({ validateBeforeSave: false });

  // Send the plain text token to the email address that the user provides
  // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

  const text = `Forgot your password? Submit a new password and confrim password by clicking the button below!`;
  const url = `http://localhost:3000`;

  try {
    await new Email(user, url).sendEmailToResetPassword("emailTemplate", {
      subject: "Your password reset token is valid for 5 mins",
      text: text,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token has been sent to the email provided",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Error sending email", 500));
  }
});

// This would receives the reset token and the updated password from the user
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // Encrypt the token, received as an url param and compare it with the token saved in the database
  // Get user based on the token
  const hash = crypto.createHash("sha256");
  const encryptedTokenString = hash.update(req.params.resettoken).digest().toString("hex");

  // The passwordResetTokenExpiresIn property should be greater than the time right now
  const user = await User.findOne({
    passwordResetToken: encryptedTokenString,
    passwordResetTokenExpiresIn: { $gt: Date.now() },
  });

  // If the token invalid and the user exists, then update the password
  if (!user) {
    return next(new AppError("Token has expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;
  await user.save();

  // Login the user and send JWT.
  const token = generateToken(user._id);
  const userWithModifiedPassword = {
    name: user.name,
    email: user.email,
  };

  res.status(200).json({
    status: "success",
    data: {
      user: userWithModifiedPassword,
      token: token,
    },
  });
});
