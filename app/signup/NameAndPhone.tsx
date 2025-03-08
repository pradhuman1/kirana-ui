import { useState, useRef, useEffect } from "react";
import Input from "../components/input";
import { checkValidMobileNumber, checkValidShopName } from "../Utils";

const NameAndPhone = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileErrorMessage, setMobileErrorMessage] = useState("");
  const [shopNameErrorMessage, setShopNameErrorMessage] = useState("");

  const [shopName, setShopName] = useState("");
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const shopNameInputRef = useRef<HTMLInputElement>(null);
  const onMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    if (value.length === 10) {
      setMobileErrorMessage("");
    }
  };

  const onShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopName(value);
    if (value.length > 0) {
      setShopNameErrorMessage("");
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onSubmit called");
    console.log(mobileNumber);
    if (!checkValidMobileNumber(mobileNumber)) {
      setMobileErrorMessage("Please enter a valid 10 digit mobile number");
      const inputElement = mobileInputRef.current;
      if (inputElement) {
        inputElement.focus();
      }
    }
    if (!checkValidShopName(shopName)) {
      setShopNameErrorMessage("Please enter a valid shop name");
      const inputElement = shopNameInputRef.current;
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  useEffect(() => {}, []);
  return (
    <>
      <Input
        id="shop_name"
        name="shop_name"
        type="text"
        required
        autoComplete="shop_name"
        value={shopName}
        onChange={onShopNameChange}
        placeholder="Enter your shop name"
        label="Shop Name"
        errorMessage={shopNameErrorMessage}
        ref={shopNameInputRef as React.RefObject<HTMLInputElement>}
      />

      <Input
        id="mobile"
        name="mobile"
        type="number"
        required
        autoComplete="mobile"
        value={mobileNumber}
        onChange={onMobileChange}
        placeholder="Enter your 10 digit mobile number"
        label="Mobile Number"
        errorMessage={mobileErrorMessage}
        ref={mobileInputRef as React.RefObject<HTMLInputElement>}
      />

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
