const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../db/userModel');
const responseUtil = require('../../utils/responseUtils');

exports.register = async (req, res) => {
  const { email, accountType, phone, password } = req.body;

  if (
    email === undefined || Object.keys(email).length === 0
    || accountType === undefined || Object.keys(accountType).length === 0
    || phone === undefined || Object.keys(phone).length === 0
    || password === undefined || Object.keys(password).length === 0
  ) {
    return res.json({ 
      "code": 0,
      "error": {
        "reason": "Missing data"
      }
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ 
        "code": 0,
        "error": {
          "reason": "Email has been registered"
        }
      });
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.json({ 
        "code": 0,
        "error": {
          "reason": "Phone number has been register"
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      accountType,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    // log in
    const loginResponse = await axios.post(
      "http://localhost:3000/api/auth/login",
      {email, password}
    );

    return res.json(loginResponse.data);
  } catch (error) {
    return res.json({ 
      "code": 0,
      "error": {
        "reason": "An error has occur while registering user."
      }
    });
  }
};

exports.updateDetails = async (req, res) => {
  const { userId } = req.user;
  const newDetails = req.body;

  try {

    if (newDetails.username) {
      // Add @ before username
      newDetails.username = `@${newDetails.username}`;

      // Check // Check if the new username is already registered
      const existingUser = await User.findOne({ username: newDetails.username });

      if (existingUser) {
        return res.json(responseUtil.createErrorResponse("Username is already registered"));
      }
    }

    // Encrypt it before updating
    if (newDetails.password) {
      newDetails.password = await bcrypt.hash(newDetails.password, 10);
    }

    // Exclude 'email' field from newDetails if it exists
    if (newDetails.email) {
      delete newDetails.email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: newDetails },
      { new: true }
    );

    if (!updatedUser) {
      return res.json(responseUtil.createErrorResponse('User not found or no updates made'));
    }

    res
      .status(200)
      .json(responseUtil.createSuccessResponse({updatedUser}));
  } catch (error) {
    res.json({ 
      code: 0,
      error: {
        message: 'Internal Server Error' 
      }
    });
  }
};

exports.getUserDetails = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json(responseUtil.createErrorResponse("User not found"));
    }

    // Exclude sensitive information (e.g., password) from the response
    const userDetails = {
      username: user.username,
      email: user.email,
      accountType: user.accountType,
      phone: user.phone,
    };

    res.status(200).json(
      responseUtil.createSuccessResponse({ 
        user: userDetails 
      })
    );
  } catch (error) {
    console.error(error);
    return res.json(responseUtil.createErrorResponse(error));
  }
};

