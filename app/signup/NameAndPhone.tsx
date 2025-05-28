import { useState, useRef, useEffect } from "react";
import Input from "../components/input";
import { checkValidMobileNumber, checkValidShopName } from "../Utils";
import ApiHelper from "../Utils/apiHelper";
import apiEndPoints from "../Utils/apiEndPoints";
import { useUser } from "../context/UserContext";

declare global {
  interface Window {
    AndroidInterface?: {
      onFormSubmit: (shopName: string, mobileNumber: string) => void;
    };
    showNameFromNative: (name: string) => void
  }
}



interface NameAndPhoneProps {
  onSubmitSuccess: () => void;
}

const NameAndPhone = ({ onSubmitSuccess }: NameAndPhoneProps) => {
  const { updateUserData } = useUser();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileErrorMessage, setMobileErrorMessage] = useState("");
  const [shopNameErrorMessage, setShopNameErrorMessage] = useState("");
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showNameFromNative = function (name: string) {
        alert("Received from native: " + name);
        console.log("Received from native: " + name);
      };
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit");
    console.log(mobileNumber);
    console.log(shopName);
    console.log(mobileErrorMessage);
    console.log(shopNameErrorMessage);
    // Validate inputs
    if (!checkValidMobileNumber(mobileNumber)) {
      setMobileErrorMessage("Please enter a valid 10 digit mobile number");
      return;
    }
    if (!checkValidShopName(shopName)) {
      setShopNameErrorMessage("Please enter a valid shop name");
      return;
    }

    try {
      setIsLoading(true);
      if (window.AndroidInterface && typeof window.AndroidInterface.onFormSubmit === 'function') {
        window.AndroidInterface.onFormSubmit(shopName, mobileNumber);
      }
      const responseObj = await ApiHelper.post(apiEndPoints.signupNew, {
        phoneNumber: mobileNumber,
        businessName: shopName,
      });

      if (responseObj.status === 200) {
        updateUserData({ shopName, mobileNumber });

        onSubmitSuccess();

      } else {
        // Handle API error
        setMobileErrorMessage(
          responseObj.data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log(error)
      setMobileErrorMessage("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="shopName"
        name="shopName"
        type="text"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        label="Shop Name"
        errorMessage={shopNameErrorMessage}
        ref={shopNameInputRef as React.RefObject<HTMLInputElement>}
      />

      <Input
        id="mobileNumber"
        name="mobileNumber"
        type="tel"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        label="Mobile Number"
        errorMessage={mobileErrorMessage}
        ref={mobileInputRef as React.RefObject<HTMLInputElement>}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isLoading ? "Processing..." : "GET OTP"}
      </button>
    </form>
  );
};

export default NameAndPhone;
