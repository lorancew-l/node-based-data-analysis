export class EmailConstraintError extends Error {
  constructor() {
    super('Account with this email already exists');
  }
}

export class InvalidCredentials extends Error {
  constructor() {
    super('Invalid password or email');
  }
}

export class InvalidToken extends Error {
  constructor() {
    super('Invalid token');
  }
}
