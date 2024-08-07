"use client";

import React, { useState, useEffect } from "react";
import { UserAuth } from "./context/AuthContext";
import Button from "@mui/material/Button";
import Link from "next/link";

const HomePage = () => {
  const { user, googleSignIn } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Sign-in failed:", error);
      setErrorMessage("Sign-in failed. Please try again.");
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      handleSignIn();
    } else {
      window.location.href = "/profile";
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };

    checkAuthentication();
  }, [user]);

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col">
      <section className="bg-blue-600 text-white py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">CKODON Project AI</h1>
        <p className="text-xl mb-6">
          Your assistant for college application project drafting
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Button variant="contained" onClick={handleGetStarted}>
              Get Started
            </Button>
          </>
        )}
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-8">
            Our mission is to deliver top-notch services that cater to your
            unique needs and exceed your expectations.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Feature One</h3>
              <p>
                Discover how our first feature can help streamline your workflow
                and improve productivity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
              <p>
                Explore the second feature that enhances your experience with
                its intuitive design.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
              <p>
                Learn about our third feature that provides unmatched
                performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-8">
            Have questions or want to learn more? Feel free to reach out to us!
          </p>
          <a
            href="mailto:info@example.com"
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Email Us
          </a>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default HomePage;
