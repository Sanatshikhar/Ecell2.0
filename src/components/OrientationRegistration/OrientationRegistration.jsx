import React, { useEffect } from "react";
import RegistrationForm from "./RegistrationForm";
import "./OrientationRegistration.css";

export default function OrientationRegistration() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "E-Cell Registration | Innovation & Entrepreneurship Cell";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <main className="orientation-page-wrapper selection:bg-purple-600 selection:text-white">
      <RegistrationForm />
    </main>
  );
}
