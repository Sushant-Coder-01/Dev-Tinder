const validator = require("validator");

validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Name is invalid!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

validateLoginData = (req) => {
  const { emailId, password } = req;

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

module.exports = { validateSignUpData, validateLoginData };
