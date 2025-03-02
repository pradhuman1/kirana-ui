import { useState, useRef } from "react";
import Input from "../components/input";
import { checkValidMobileNumber } from "../Utils";

const NameAndPhone = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [shopName, setShopName] = useState("");
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    if (value.length === 10) {
      setErrorMessage("");
    }
  };

  const onShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopName(value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onSubmit called");
    console.log(mobileNumber);
    if (!checkValidMobileNumber(mobileNumber)) {
      setErrorMessage("Please enter a valid 10 digit mobile number");
      const inputElement = mobileInputRef.current;
      if (inputElement) {
        inputElement.focus();
      }
    }
  };
  return (
    <>
      <div>
        <label
          htmlFor="shop_name"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Shop Name
        </label>
        <div className="mt-2">
          <Input
            id="shop_name"
            name="shop_name"
            type="text"
            required
            autoComplete="shop_name"
            value={shopName}
            onChange={onShopNameChange}
            placeholder="Enter your shop name"
            ref={mobileInputRef as React.RefObject<HTMLInputElement>}
          />
        </div>

        <div className="mt-2 text-sm text-red-600 min-h-[20px]">
          {errorMessage}
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Mobile Number
        </label>
        <div className="mt-2">
          <Input
            id="mobile"
            name="mobile"
            type="number"
            required
            autoComplete="mobile"
            value={mobileNumber}
            onChange={onMobileChange}
            placeholder="Enter your 10 digit mobile number"
            ref={mobileInputRef as React.RefObject<HTMLInputElement>}
          />
        </div>

        <div className="mt-2 text-sm text-red-600 min-h-[20px]">
          {errorMessage}
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        GET OTP
      </button>
    </>
  );
};

export default NameAndPhone;
