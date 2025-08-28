import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from query params
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/jobs";

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: email,  // Backend expects user_id
          password: password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // Store user data in localStorage
      const userData = data.result && data.result.length > 0 ? data.result[0] : null; // Safely access result array
      if (userData) {
        const { password: _, ...userWithoutPassword } = userData;
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        
        // Store JWT token if provided
        const authToken = response.headers.get('X-AUTH-TOKEN');
        if (authToken) {
          localStorage.setItem("authToken", authToken);
        }
        
        // Dispatch custom event to notify navbar and other components
        window.dispatchEvent(new Event("userStateChanged"));

        // Redirect to the return URL or default based on user role
        if (returnTo && returnTo !== "/jobs") {
          navigate(returnTo);
        } else {
          navigate(userData.role === "recruiter" ? "/dashboard" : "/jobs");
        }
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center pb-15 px-10 sm:px-6 lg:px-8"
      data-oid="eib2:-x"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md" data-oid="jzjtco8">
        <h2
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          data-oid="275sp8y"
        >
          Sign in to your account
        </h2>
        <p
          className="mt-2 text-center text-sm text-gray-600"
          data-oid="t-7ullz"
        >
          Or{" "}
          <Link
            to={`/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className="font-medium text-blue-600 hover:text-blue-500"
            data-oid="wv2nopw"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" data-oid="y95fiq2">
        <div
          className="bg-white py-10 px-6 shadow sm:rounded-lg sm:px-10"
          data-oid="oi:::ym"
        >
          {error && (
            <div
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start"
              data-oid="p-jrowm"
            >
              <AlertCircle
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                data-oid="1jbs1kc"
              />
              <span data-oid="t:xjchl">{error}</span>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            data-oid="kfh2:mp"
          >
            <div data-oid="wnk78s3">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
                data-oid="ny:7x:j"
              >
                Email address
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="xymv0u9"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="ojbbw02"
                >
                  <Mail className="h-5 w-5 text-gray-400" data-oid="vr88qu." />
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
                  data-oid="a:y5g-j"
                />
              </div>
            </div>

            <div data-oid="6b8rd1b">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
                data-oid="1l8ugxq"
              >
                Password
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="6lcy2vx"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="cqxdn3h"
                >
                  <Lock className="h-5 w-5 text-gray-400" data-oid="i78cb14" />
                </div>
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full"
                  data-oid="5_908mv"
                />
              </div>
            </div>

            <div
              className="flex items-center justify-between"
              data-oid="8z6jdag"
            >
              <div className="flex items-center" data-oid="v3431bb">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  data-oid="5gujplr"
                />

                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                  data-oid="9ouw070"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm" data-oid="55gsmav">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  data-oid="vbfr4ua"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div data-oid="oneyyu:">
              <Button
                variant="blue"
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-oid="pp4s9w."
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
