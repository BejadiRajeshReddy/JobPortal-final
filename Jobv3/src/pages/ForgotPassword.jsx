import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email === email);

      if (!user) {
        throw new Error("No account found with this email address");
      }

      // In a real application, you would:
      // 1. Generate a secure reset token
      // 2. Store it in the database with an expiration
      // 3. Send an email with a reset link

      // For demo purposes, we'll just show a success message
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center pb-15 px-10 sm:px-6 lg:px-8"
      data-oid="sbptm3a"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md" data-oid="kvlwqxg">
        <h2
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          data-oid="a5jquxy"
        >
          Reset your password
        </h2>
        <p
          className="mt-2 text-center text-sm text-gray-600"
          data-oid="2b4bknd"
        >
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" data-oid="5u3:i51">
        <div
          className="bg-white py-10 px-6 shadow sm:rounded-lg sm:px-10"
          data-oid="ekep0:y"
        >
          {error && (
            <div
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start"
              data-oid="a8q88vp"
            >
              <AlertCircle
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                data-oid="vfc5_2r"
              />
              <span data-oid="m1ot81h">{error}</span>
            </div>
          )}

          {success && (
            <div
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start"
              data-oid="zsv7asi"
            >
              <CheckCircle
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                data-oid="y-lsi1c"
              />
              <span data-oid="dum5lg5">
                If an account exists with this email, you will receive password
                reset instructions.
              </span>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            data-oid="k62w60z"
          >
            <div data-oid="l3fpylj">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
                data-oid="dvxdmzp"
              >
                Email address
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="czob2t."
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="m-ci13k"
                >
                  <Mail className="h-5 w-5 text-gray-400" data-oid="6bbwwop" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full"
                  data-oid="j-talem"
                />
              </div>
            </div>

            <div data-oid="25woe_y">
              <Button
                variant="blue"
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-oid="ez:-aoa"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </div>

            <div className="text-center" data-oid="e-pk31_">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
                data-oid="ad5i359"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
