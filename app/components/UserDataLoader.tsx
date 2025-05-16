"use client";

import { useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function UserDataLoader() {
  const { loadUserDataFromStorage } = useUser();

  useEffect(() => {
    loadUserDataFromStorage();
  }, [loadUserDataFromStorage]);

  return null;
}
