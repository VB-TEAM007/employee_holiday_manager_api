export class ApiError extends Error {
  status: number;
  message: string;
  errors: any

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Unauthorized() {
      return new ApiError(401, 'Unathorized user')
  }
  
  static NotFound() {
    return new ApiError(404, 'Not found')
  }

  static BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
  }
}
