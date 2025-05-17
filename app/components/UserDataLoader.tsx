"use client";

import { useEffect } from "react";
import { useUser } from "../context/UserContext";

declare global {
  interface Window {
    __userDataLoaded?: boolean;
  }
}

export default function UserDataLoader() {
  const { loadUserDataFromStorage } = useUser();

  useEffect(() => {
    if (!window.__userDataLoaded) {
      loadUserDataFromStorage();
      window.__userDataLoaded = true;
    }
  }, []);

  return null;
}
