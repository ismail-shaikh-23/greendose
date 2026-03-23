// CustomError.js 
class CustomError extends Error { 
  constructor(message, statusCode) { 
    super(message); 
    this.statusCode = statusCode; 
    this.name = this.constructor.name; 
  } 
} 

class ValidationError extends CustomError { 
  constructor(message = 'Validation Error') { 
    super(message, 400); 
  } 
} 

class NoDataFoundError extends CustomError { 
  constructor(message = 'No Data Found') { 
    super(message, 200); 
  } 
}

class BadRequestError extends CustomError { 
  constructor(message = 'Bad Request') { 
    super(message, 400); 
  } 
} 

class InternalServerError extends CustomError { 
  constructor(message = 'Internal Server Error') { 
    super(message, 500); 
  } 
} 

class UnauthorizedError extends CustomError { 
  constructor(message = 'Unauthorized') { 
    super(message, 401); 
  } 
} 

class ForbiddenError extends CustomError { 
  constructor(message = 'Forbidden') { 
    super(message, 403); 
  } 
} 

class OKStatus extends CustomError { 
  constructor(message = 'OK') { 
    super(message, 200); 
  } 
} 

class UnprocessableEntityError extends CustomError { 
  constructor(message = 'Unprocessable Entity') { 
    super(message, 422); 
  } 
} 

module.exports = { 
  CustomError, 
  ValidationError, 
  NoDataFoundError, 
  BadRequestError, 
  InternalServerError, 
  UnauthorizedError, 
  ForbiddenError, 
  OKStatus, 
  UnprocessableEntityError, 
}; 
