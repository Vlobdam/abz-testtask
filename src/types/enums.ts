export enum ErrorType {
  USER_EXISTS = "User with this phone or email already exist",
  INVALID_TOKEN = "Invalid token. Try to get a new one by the method GET api/v1/token.",
}

export enum ButtonType {
  SUBMIT = "submit",
  BUTTON = "button",
  RESET = "reset",
}