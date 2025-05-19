import ApiHelper from "./apiHelper";
import apiEndPoints from "./apiEndPoints";

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

interface VerifyOtpResponse {
  businessId: string;
  token: string;
}

interface VerifyOtpParams {
  otp: string;
  businessName: string;
  phoneNumber: string;
  updateUserData: (data: { businessId: string; token: string }) => void;
  onSubmitSuccess: () => void;
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "Something went wrong"
): string => {
  const apiError = error as ApiError;

  // Check for direct message property
  if (apiError?.message) {
    return apiError.message;
  }

  // Check for response data message (common in axios errors)
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }

  return defaultMessage;
};

export const verifyOtpAndCreateBusiness = async ({
  otp,
  businessName,
  phoneNumber,
  updateUserData,
  onSubmitSuccess,
}: VerifyOtpParams): Promise<{ error?: string }> => {
  if (!checkValidOtp(otp)) {
    return { error: "Please enter a valid OTP" };
  }

  try {
    const responseObj = await ApiHelper.post(
      apiEndPoints.verifyOtpAndCreateBusiness,
      {
        otp,
        businessName,
        phoneNumber,
      }
    );

    if (responseObj.status === 200) {
      const { businessId, token } = responseObj.data;
      updateUserData({ businessId, token });
      onSubmitSuccess();
      return {};
    }
    return { error: "Failed to verify OTP" };
  } catch (error) {
    return { error: getErrorMessage(error, "Failed to verify OTP") };
  }
};
