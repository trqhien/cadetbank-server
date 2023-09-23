const responseUtil = require('../utils/responseUtils');

module.exports = (req, res, next) => {
  const { referer } = req.headers;

  if (referer && referer.includes('/docs')) {
    return res.json(responseUtil.createErrorResponse("Access restricted")); 
  } else {
    next()
  }
};
