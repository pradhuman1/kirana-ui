"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  shopName?: string;
  mobileNumber?: string;
  address?: string;
  locationCoordinates?: {
    latitude?: number;
    longitude?: number;
  };
  businessId?: string;
  token?: string;
  // Add other user-related fields as needed
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  loadUserDataFromStorage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({});

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => {
      const newData = { ...prev, ...data };
      localStorage.setItem("userData", JSON.stringify(newData));
      return newData;
    });
  };

  const loadUserDataFromStorage = () => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  };

  return (
    <UserContext.Provider
      value={{ userData, updateUserData, loadUserDataFromStorage }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
