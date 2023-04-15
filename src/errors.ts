const Errors = {
  UNAUTHORIZED: "Unauthorized",
  INTERNAL_SERVER_ERROR:
    "An error occurred while trying to complete this request, please ensure the request was properly made.",
  ACCOUNT_EXISTS:
    "The provided email or username is registered to another account.",
  INVALID_LOGIN: "An invalid email or password was provided.",
  TOKEN_EXPIRED: "The provided token has expired",
  UNVERIFIED: "The provided account has not been verified",
};

export default Errors;
