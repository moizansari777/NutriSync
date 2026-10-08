import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";

export const getPhoneDetails = (number: string, country: any) => {
  const phoneNumber = parsePhoneNumberFromString(
    number,
    country?.toUpperCase(),
  );

  if (!phoneNumber) {
    return {
      isValid: false,
    };
  }

  return {
    isValid: phoneNumber.isValid(),
    countryCode: `+${phoneNumber.countryCallingCode}`,
    nationalNumber: phoneNumber.nationalNumber,
    internationalNumber: phoneNumber.formatInternational(),
    fullNumber: phoneNumber.number,
  };
};
