/*
1. Get the user's current location
2. Show the user's current location on the map (auto select)
3. User Should be able to move the map and select the location
4. On submit send the latitude and longitude to the backend`



*/

import MapRender from "../components/maps";
import { useState, useEffect } from "react";

const GeoLocation = () => {
  const [userCurrentLocation, setUserCurrentLocation] = useState<any>(null);
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>("");

  useEffect(() => {
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
  }, []);

  const onUpdateLocation = (event: any) => {
    console.log(event);
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setUserCurrentLocation({ lat: newLat, lng: newLng });
  };

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
  const onSubmit = () => {
    const { lat, lng } = userCurrentLocation;
    if (!lat || !lng) {
      setLocationErrorMessage("Please select the location");
      return;
    }
  };
  return (
    <>
      <i>Click to update the current location</i>
      <button
        type="button"
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 hover:cursor-pointer font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        //className="rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
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
      </button>

      <MapRender
        currentLocation={userCurrentLocation}
        onUpdateLocation={onUpdateLocation}
      />
      <button
        onClick={onSubmit}
        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 hover:cursor-pointer font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Finish
      </button>
    </>
  );
};

export default GeoLocation;
