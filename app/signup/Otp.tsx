import { useState, useRef } from "react";
import Input from "../components/input";
import { checkValidOtp } from "../Utils";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [otpErrorMessage, setOtpErrorMessage] = useState("");

  const otpInputRef = useRef<HTMLInputElement>(null);

  const onOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    setOtpErrorMessage("");
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onSubmit called");
    console.log(otp);
    if (!checkValidOtp(otp)) {
      setOtpErrorMessage("Please enter a valid OTP");
      const inputElement = otpInputRef.current;
      if (inputElement) {
        inputElement.focus();
      }
    }
  };
  return (
    <>
      <div>
        <Input
          id="otp"
          name="otp"
          type="number"
          required
          value={otp}
          onChange={onOtpChange}
          placeholder="Enter your Recieved OTP"
          label="OTP"
          ref={otpInputRef as React.RefObject<HTMLInputElement>}
          errorMessage={otpErrorMessage}
        />
      </div>
      <button
        onClick={onSubmit}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Verify OTP
      </button>
    </>
  );
};

export default Otp;
