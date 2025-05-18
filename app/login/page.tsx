"use client";
import { useState, useRef } from "react";
import { checkValidMobileNumber } from "../Utils";
import RedirectionInfo from "../components/Functional/RedirectionInfo";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [pageStep, setPageStep] = useState("sing-in");

  const mobileInputRef = useRef<HTMLInputElement>(null);

  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    if (value.length === 10) {
      setErrorMessage("");
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onSubmit called");
    console.log(mobileNumber);
    if (!checkValidMobileNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid 10 digit mobile number");
      mobileInputRef.current?.focus();
    } else {
      setPageStep("otp");
    }
  };

  const renderMobileInput = () => {
    return (
      <input
        id="mobile"
        name="mobile"
        type="number"
        required
        autoComplete="mobile"
        autoFocus={true}
        value={mobileNumber}
        onChange={onMobileChange}
        placeholder="Enter your 10 digit mobile number"
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        ref={mobileInputRef}
      />
    );
  };

  const onOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
  };

  const renderOtpInput = () => {
    return (
      <input
        id="otp"
        name="otp"
        type="number"
        required
        autoComplete="mobile"
        autoFocus={true}
        value={otp}
        onChange={onOtpChange}
        placeholder="Enter the OTP"
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        ref={mobileInputRef}
      />
    );
  };

  const renderInput = () => {
    switch (pageStep) {
      case "sing-in":
        return renderMobileInput();
      case "otp":
        return renderOtpInput();
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
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                {pageStep === "sing-in"
                  ? "Mobile Number"
                  : `Otp sent to ${mobileNumber}`}
              </label>
              <div className="mt-2">{renderInput()}</div>

              <div className="mt-2 text-sm text-red-600 min-h-[20px]">
                {errorMessage}
              </div>
            </div>

            {/* <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div> */}

            <div>
              <button
                onClick={onSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-[10px]"
              >
                {pageStep === "sing-in" ? "GET OTP" : "VERIFY OTP"}
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
