export const checkValidMobileNumber = (mobileNumber: string) => {
  if (mobileNumber.length !== 10) {
    return false;
  }
  return true;
};

export const checkValidShopName = (shopName: string = "") => {
  if (shopName.length === 0) {
    return false;
  }
  return true;
};

export const checkValidOtp = (otp: string) => {
  if (otp.length !== 4) {
    return false;
  }
  return true;
};

export const checkValidPincode = (pincode: string = "") => {
  // Check if pincode is exactly 6 digits
  if (pincode.length !== 6) {
    return false;
  }

  // Check if pincode contains only numbers
  const pincodeRegex = /^[0-9]{6}$/;
  if (!pincodeRegex.test(pincode)) {
    return false;
  }

  // First digit of Indian pincodes cannot be 0
  if (pincode[0] === "0") {
    return false;
  }

  return true;
};

export const checkValidAddress = (address: string = "") => {
  if (address.length === 0) {
    return false;
  }
  return true;
};

export const checkValidLandmark = (landmark: string = "") => {
  if (landmark.length === 0) {
    return false;
  }
  return true;
};
