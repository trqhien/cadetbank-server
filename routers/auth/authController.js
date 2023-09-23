const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../db/userModel');
const BlacklistToken = require('../../db/blacklistToken');
const responseUtil = require('../../utils/responseUtils');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json(responseUtil.createErrorResponse("Authentication failed"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json(responseUtil.createErrorResponse("Authentication failed"));
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', {expiresIn: '1h'});
    const refreshToken = jwt.sign({ userId: user._id }, 'refreshSecretKey', { expiresIn: '30d' });

    return res.json(
      responseUtil.createSuccessResponse({
        token,
        refreshToken,
        user: {
          username: user.username,
          email: user.email,
          accountType: user.accountType,
          phone: user.phone,
        }
      })
    );
  } catch (error) {
    return res.json(responseUtil.createErrorResponse("Authentication failed"));
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const newBlacklist = new BlacklistToken({ token });
    await newBlacklist.save();

    return res.json(
      responseUtil.createSuccessResponse({
        message: "Logged out successfully"
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, 'refreshSecretKey');
    
    // Check if the refresh token is valid
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.json(responseUtil.createErrorResponse('Invalid or expired refresh token'));
    }

    // Generate a new access token
    const accessToken = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res
      .status(200)
      .json({ accessToken });
  } catch (error) {
    res.json(responseUtil.createErrorResponse('Invalid or expired refresh token'));
  }
};
