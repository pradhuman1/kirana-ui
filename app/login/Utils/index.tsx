export const checkValidMobileNumber = (mobileNumber: string) => {
  if (mobileNumber.length !== 10) {
    return false;
  }
  return true;
};
