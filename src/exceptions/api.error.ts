interface ApiErrorParams {
  message: string;
  status: number;
  errors?: any;
}

export class ApiError extends Error {
  message: string;
  status: number;
  errors: any

  constructor({ message, status, errors = {} } : ApiErrorParams) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError({
      message,
      errors,
      status: 400
    })
  }

  static unauthorized() {
    return new ApiError({
      message: 'unauthorized user',
      status: 401
    })
  }

  static notFound() {
    return new ApiError({
      message: 'not found',
      status: 404
    })
  }
}
