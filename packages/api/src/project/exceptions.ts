export class ProjectAccessDenied extends Error {
  constructor() {
    super('Project access denied');
  }
}

export class MissingParameter extends Error {
  constructor(parameter: string) {
    super(`Missing ${parameter}`);
  }
}
