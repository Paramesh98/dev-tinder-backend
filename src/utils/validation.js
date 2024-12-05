const validator = require("validator");
const vlaidateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid firstName or lastName");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be between 4 and 50 characters long");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name should be between 4 and 50 characters long");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
};

const validateMyEditProfileData = (req) => {
  try {
    const ALLOWED_KEYS = [
      "age",
      "about",
      "gender",
      "skills",
      "photoUrl",
      "firstName",
      "lastName",
    ];
    Object.keys(req.body).every((key) => {
      if (!ALLOWED_KEYS.includes(key)) {
        throw new Error(`Cant update the field ${key}`);
      }
    });
  } catch (err) {
    throw new Error(`Something went wrong ${err.message}`);
  }
};

module.exports = { vlaidateSignUpData, validateMyEditProfileData };
