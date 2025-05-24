"use client";
import { useState, useRef } from "react";
import { checkValidMobileNumber, checkValidOtp } from "../Utils";
import RedirectionInfo from "../components/Functional/RedirectionInfo";
import Input from "../components/input";
import ApiHelper, { handleApiError } from "../Utils/apiHelper";
import apiEndPoints from "../Utils/apiEndPoints";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const Login = () => {
  const router = useRouter();
  const { updateUserData } = useUser();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageStep, setPageStep] = useState("sing-in");
  const [isLoading, setIsLoading] = useState(false);

  const mobileInputRef = useRef<HTMLInputElement>(null);

  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    if (value.length === 10) {
      setErrorMessage("");
    }
  };

  const initiateLogin = async () => {
    if (!checkValidMobileNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid 10 digit mobile number");
      mobileInputRef.current?.focus();
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiHelper.post(apiEndPoints.initiateLogin, {
        phoneNumber: mobileNumber,
      });

      if (response.status === 200) {
        setPageStep("otp");
        setErrorMessage("");
      }
    } catch (error) {
      const { message } = handleApiError(error, "Failed to send OTP");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndLogin = async () => {
    if (!checkValidOtp(otp)) {
      setErrorMessage("Please enter a valid 4 digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiHelper.post(apiEndPoints.verifyOtpAndLogin, {
        phoneNumber: mobileNumber,
        otp,
      });

      if (response.status === 200) {
        const { businessId, token } = response.data;
        updateUserData({ businessId, token });
        router.push("/dashboard");
      }
    } catch (error) {
      const { message } = handleApiError(error, "Failed to verify OTP");
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (pageStep === "sing-in") {
      initiateLogin();
    } else {
      verifyOtpAndLogin();
    }
  };

  const onOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    if (value.length === 4) {
      setErrorMessage("");
    }
  };

  const renderInput = () => {
    switch (pageStep) {
      case "sing-in":
        return (
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            required
            autoComplete="tel"
            autoFocus={true}
            value={mobileNumber}
            onChange={onMobileChange}
            placeholder="Enter your 10 digit mobile number"
            label="Mobile Number"
            errorMessage={errorMessage}
            ref={mobileInputRef}
            isDisabled={isLoading}
          />
        );
      case "otp":
        return (
          <Input
            id="otp"
            name="otp"
            type="number"
            required
            autoComplete="one-time-code"
            autoFocus={true}
            value={otp}
            onChange={onOtpChange}
            placeholder="Enter the OTP"
            label={`OTP sent to ${mobileNumber}`}
            errorMessage={errorMessage}
            ref={mobileInputRef}
            isDisabled={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Kirana Shop"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your shop
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>{renderInput()}</div>

            <div>
              <button
                onClick={onSubmit}
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : pageStep === "sing-in" ? (
                  "GET OTP"
                ) : (
                  "VERIFY OTP"
                )}
              </button>
            </div>
          </div>

          <RedirectionInfo
            message="Not a member?"
            linkText="Sign Up Now"
            href="/signup"
          />
        </div>
      </div>
    </>
  );
};

export default Login;
