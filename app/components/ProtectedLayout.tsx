"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const preAuthRoutes = ["/login", "/signup"];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    const isAuthenticated = !!userData;

    if (preAuthRoutes.includes(pathname)) {
      if (isAuthenticated) {
        // Redirect authenticated users away from login/signup
        router.replace("/dashboard/products");
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } else {
      if (!isAuthenticated) {
        // Redirect unauthenticated users away from protected routes
        router.replace("/login");
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    }
  }, [pathname]);

  if (isAllowed === null) {
    // Optional loading spinner while checking auth
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return isAllowed ? <>{children}</> : null;
}