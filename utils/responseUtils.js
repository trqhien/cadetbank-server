function createErrorResponse(reason) {
  return {
    code: 0,
    error: {
      reason: reason
    }
  };
}

function createSuccessResponse(responseObject) {
  return {
    code: 1,
    response: responseObject
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse
};