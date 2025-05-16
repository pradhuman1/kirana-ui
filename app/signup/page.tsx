"use client";
import { useState } from "react";
import NameAndPhone from "./NameAndPhone";
import Otp from "./Otp";
import LocationAndAddress from "./LocationAndAddress";
import GeoLocation from "./GeoLocation";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const getPageStep = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pageStep") || "nameAndPhone";
    }
    return "nameAndPhone";
  };

  const [pageStep, setPageStep] = useState(getPageStep);

  const updatePageStep = (step: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pageStep", step);
    }
    if (step === "signupComplete") {
      router.push("/dashboard");
    }
    setPageStep(step);
  };

  const renderView = () => {
    switch (pageStep) {
      case "nameAndPhone":
        return <NameAndPhone onSubmitSuccess={() => updatePageStep("otp")} />;
      case "otp":
        return (
          <Otp onSubmitSuccess={() => updatePageStep("locationAndAddress")} />
        );
      case "locationAndAddress":
        return (
          <LocationAndAddress
            onSubmitSuccess={() => updatePageStep("geoLocation")}
          />
        );
      case "geoLocation":
        return (
          <GeoLocation
            onSubmitSuccess={() => updatePageStep("signupComplete")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Kirana Shop"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <div className="lg:mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create a new account and start selling
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {renderView()}
      </div>
    </div>
  );
};

export default Signup;
