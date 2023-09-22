function createErrorResponse(reason) {
  return {
    code: 0,
    error: { reason }
  };
}

function createSuccessResponse(responseObject) {
  return {
    code: 1,
    response: responseObject
  };
}

function tokenExpired() {
  return {
    code: 3,
    error: {
      reason: "Token has expired"
    }
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  tokenExpired
};