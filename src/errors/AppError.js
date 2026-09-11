export class AppError extends Error {
  constructor(message, exitCode = 1, options = {}) {
    super(message, options);
    this.name = 'AppError';
    this.exitCode = exitCode;
  }
}

export class ArgumentError extends AppError {
  constructor(message) {
    super(message, 1);
    this.name = 'ArgumentError';
  }
}