const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('blacklist', blacklistTokenSchema);