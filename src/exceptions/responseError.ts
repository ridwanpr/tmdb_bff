export class ResponseError extends Error {
  constructor(
    public status: number,
    public override message: string,
  ) {
    super(message);
  }
}

export class ExternalServiceError extends Error {
  constructor(
    public status: number,
    message: string,
    public service?: string,
  ) {
    super(message);
    this.name = "ExternalServiceError";
  }
}
