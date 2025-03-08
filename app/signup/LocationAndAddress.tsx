import { useEffect, useState } from "react";
import { checkValidPincode } from "../Utils";
import Input from "../components/input";
import TextArea from "../components/TextArea";
import MapRender from "../components/maps";
import Select from "../components/Select";
import { checkValidAddress, checkValidLandmark } from "../Utils";

const LocationAndAddress = () => {
  const [currentLocation, setUserCurrentLocation] = useState<any>(null);
  const [pincode, setPincode] = useState<string>("");
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState<string>("");

  const [city, setCity] = useState<{ id: number; label: string }>({
    id: 0,
    label: "",
  });

  const [landmark, setLandmark] = useState<string>("");
  const [landmarkErrorMessage, setLandmarkErrorMessage] = useState<string>("");

  const [address, setAddress] = useState<string>("");
  const [addressErrorMessage, setAddressErrorMessage] = useState<string>("");

  /*api key for google maps*/
  const apiKey = "AIzaSyD-hU8ShZa9sMcqzS4are3j4UsMK0o-Wp4";

  //   useEffect(() => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         console.log(position);

  //       });
  //     }
  //}, []);
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("current location is", currentLocation);
        setUserCurrentLocation(currentLocation);
      });
    }
  };

  const onLandmarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLandmark(e.target.value);
    if (checkValidLandmark(e.target.value)) {
      setLandmarkErrorMessage("");
    }
  };

  const onPincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPincode(e.target.value);

    if (checkValidPincode(e.target.value)) {
      setPincodeErrorMessage("");
    }
  };

  const onAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
    if (checkValidAddress(e.target.value)) {
      setAddressErrorMessage("");
    }
  };

  const onCityChange = (option: { id: number; label: string }) => {
    setCity(option);
  };

  const onSubmit = () => {
    if (!checkValidAddress(address)) {
      setAddressErrorMessage("Please enter a valid address");
    }
    if (!checkValidLandmark(landmark)) {
      setLandmarkErrorMessage("Please enter a valid landmark");
    }
    if (!checkValidPincode(pincode)) {
      setPincodeErrorMessage("Please enter a valid pincode");
    }

    if (addressErrorMessage || landmarkErrorMessage || pincodeErrorMessage) {
      return;
    }
  };

  return (
    <>
      <TextArea
        label="Address"
        name="address"
        rows={2}
        onChange={onAddressChange}
        errorMessage={addressErrorMessage}
      />

      <Select label="City" onChange={onCityChange} />

      <Input
        label="Landmark"
        name="landmark"
        value={landmark}
        onChange={onLandmarkChange}
        placeholder="Enter nearby landmark"
        id="landmark"
        type="text"
        errorMessage={landmarkErrorMessage}
      />
      <Input
        label="Pincode"
        name="pincode"
        value={pincode}
        onChange={onPincodeChange}
        placeholder="Enter pincode"
        id="pincode"
        type="text"
        errorMessage={pincodeErrorMessage}
      />
      {/* <button
        type="button"
        className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
        onClick={() => {
          getLocation();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        Get Location
      </button> */}
      {/* <MapRender currentLocation={currentLocation} /> */}
      <button
        onClick={onSubmit}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 hover:cursor-pointer font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Next Set Location
      </button>
    </>
  );
};

export default LocationAndAddress;

/*
1. Get api key from google maps
2 Pass this api key to https://www.npmjs.com/package/@react-google-maps/api component
3 Get the geo location of the user from JavaScript geoLocation api and pass it to the component as props
4 If user updates the location from google maps, then update the location captured from JavaScript geoLocation api
*/
