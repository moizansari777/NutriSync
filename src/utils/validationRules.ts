




export const EMAIL_RULES = {
  required: "Required",
  pattern: {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    message: "Invalid email format",
  },
};

export const PHONE_RULES = {
  required: "Required",
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: "Invalid phone number format",
  },
};

export const PASSWORD_RULES = {
  required: "Required",
  // minLength: {
  //   value: 6,
  //   message: "Password must be at least 6 characters long",
  // },
};

export const SIGNUP_PASSWORD_RULES = {
  required: "Required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters long",
  },
  maxLength: {
    value: 16,
    message: "Password cannot be more than 16 characters long",
  },
  // pattern: {
  //   value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/,
  //   message:
  //     "Password must include at least 1 uppercase letter, 1 number, and 1 special character",
  // },
};

export const REQUIRED_RULE = {
  required: "Required",
  minLength: {
    value: 3,
    message: "Must be at least 3 characters long",
  },
  maxLength: {
    value: 50,
    message: "Name is too long. Keep it under 50 characters.",
  },
};

export const NUMBER_RULE = {
  required: "Required",
  pattern: {
    value: /^[1-9]\d{0,7}$/,
    message: "Invalid value! It should be a number",
  },
};

export const NUMBER_RULE_STATISTICS = {
  required: false,
  validate: (value: string) => {
    if (!value) return true; // allow empty value

    return /^[1-9]\d{0,7}$/.test(value) || "Invalid value";
  },
};

export const DECIMAL_RULE = {
  required: "Required",
  pattern: {
    value: /^[1-9]\d{0,7}(\.\d{1,3})?$/,
    message: "Invalid value! It should be a number",
  },
};

export const DECIMAL_RULE_WITH_ZERO = {
  required: "Required",
  pattern: {
    value: /^(0|[1-9]\d{0,7})(\.\d{1,3})?$/,
    message: "Invalid value",
  },
};

export const DECIMAL_RULE_WITH_ZERO_STATISTICS = {
  required: false,
  validate: (value: string) => {
    if (!value) return true; // allow empty value

    return /^(0|[1-9]\d{0,7})(\.\d{1,3})?$/.test(value) || "Invalid value";
  },
};

export const SLEEP_RULES = {
  required: false,
  validate: (value: string) => {
    if (!value) return true;

    const isValidFormat = /^(0|[1-9]\d{0,1})(\.\d{1,3})?$/.test(value);

    if (!isValidFormat) return "Invalid value";

    const numericValue = Number(value);

    if (numericValue > 24) {
      return "Sleep hours cannot exceed 24";
    }

    return true;
  },
};

export const MESSAGE_RULES = {
  required: "Required",
  minLength: {
    value: 3,
    message: "Must be at least 3 characters long",
  },
  maxLength: {
    value: 2000,
    message: `Message cannot be more than 2000 characters long`,
  },
};

export const WATER_TARGET_RULE = {
  required: false,
  validate: (value: string) => {
    if (!value) return true;

    if (!/^\d+$/.test(value)) return "Enter whole liters only";

    return Number(value) <= 20 || "Value cannot exceed 20 ltr";
  },
};

export const DIGITS_RULE = {
  required: "Required",
  pattern: {
    value: /^[0-9]\d{0,5}$/,
    message: "Invalid value! It should be a number",
  },
};

export const HEIGHT_RULE = {
  required: "Required",
  pattern: {
    value: /^[1-9]\d*(\.\d+)?$/,
    message: "Invalid value",
  },
};

export const CUSTOM_RULE = { type: "custom", message: "Required" };

import { getPhoneDetails } from "../utils/validatePhoneNumber";

export const PHONE_RULES2 = (selectedCountryCode?: string) => ({
  required: "Phone number is required",
  validate: (value: string) => {
    if (!selectedCountryCode) return true;
    const result = getPhoneDetails(value, selectedCountryCode);
    return result?.isValid || "Invalid phone number format";
  },
});

