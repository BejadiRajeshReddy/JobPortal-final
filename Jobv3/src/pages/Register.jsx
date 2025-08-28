import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  Briefcase as BriefcaseBusiness,
  Building2,
  Phone,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from query params
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/jobs";
  const roleParam = searchParams.get("role");

  // Set initial role based on URL parameter
  React.useEffect(() => {
    if (roleParam === "recruiter") {
      setRole("recruiter");
    }
  }, [roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !confirmPassword || !phoneNumber) {
      setError("All fields are required");
      return;
    }

    if (role === "candidate" && !email) {
      setError("Email is required");
      return;
    }

    if (role === "recruiter" && (!orgName || !orgEmail)) {
      setError("Organization details are required");
      return;
    }

    // Additional validation for recruiter fields
    if (role === "recruiter") {
      if (orgName.trim().length < 2) {
        setError("Organization name must be at least 2 characters long");
        return;
      }
      
      // Basic email validation for org email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orgEmail)) {
        setError("Please enter a valid organization email address");
        return;
      }
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Build the payload for the backend
      const payload = {
        name,
        password,
        role,
        phoneNumber,
        ...(role === "candidate"
          ? { email }
          : { 
              email: orgEmail, // Backend expects 'email' field for all users
              orgName,
              orgEmail,
              user_id: orgEmail // For login purposes
            })
      };

      console.log("Sending registration payload:", payload);

      const response = await fetch("http://localhost:8080/auth/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Registration response status:", response.status);
      
      const data = await response.json();
      console.log("Registration response data:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to register");
      }
      
      // Show success message
      alert("Registration successful! Please log in with your credentials.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Fallback: Store user data locally if backend is unavailable
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        try {
          const userData = {
            id: Date.now().toString(),
            name,
            role,
            phoneNumber,
            ...(role === "candidate"
              ? { email, user_id: email }
              : { 
                  email: orgEmail,
                  orgName, 
                  orgEmail, 
                  user_id: orgEmail
                })
          };
          
          // Store in localStorage as fallback
          const existingUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
          existingUsers.push(userData);
          localStorage.setItem("localUsers", JSON.stringify(existingUsers));
          
          alert("Registration saved locally (backend unavailable). You can now log in.");
          navigate("/login");
          return;
        } catch (localError) {
          console.error("Local storage error:", localError);
        }
      }
      
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center   pb-10 px-8 lg:px-8 "
      data-oid="l9gq1a:"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md" data-oid="n2dzxrf">
        <h2
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          data-oid="h730z6z"
        >
          Create your account
        </h2>
        <p
          className="mt-2 text-center text-sm text-gray-600"
          data-oid="ysc.703"
        >
          Or{" "}
          <Link
            to={`/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            className="font-medium text-blue-600 hover:text-blue-500"
            data-oid="4xzw883"
          >
            sign in to existing account
          </Link>
        </p>
      </div>

      <div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md "
        data-oid="7385:h-"
      >
        <div
          className="bg-white py-8 px-4 shadow rounded-lg sm:px-10"
          data-oid="h9e122_"
        >
          {error && (
            <div
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-8 py-3 rounded-md flex items-start"
              data-oid="ew9ja49"
            >
              <AlertCircle
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                data-oid="4-fxts9"
              />
              <span data-oid="iksu33j">{error}</span>
            </div>
          )}
          {/* Role Selection */}
          <div className="mb-4" data-oid="kfwe.ip">
            <div className="grid grid-cols-2 gap-3" data-oid="w-4fkfp">
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all flex items-center justify-center ${
                  role === "candidate"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setRole("candidate")}
                data-oid="zdk1hwr"
              >
                <UserIcon
                  className={`h-5 w-5 mr-2 ${
                    role === "candidate" ? "text-blue-500" : "text-gray-400"
                  }`}
                  data-oid="l92ox5q"
                />

                <span
                  className={
                    role === "candidate"
                      ? "text-blue-700 font-medium"
                      : "text-gray-700"
                  }
                  data-oid="bwonzk3"
                >
                  Job Seeker
                </span>
              </div>
              <div
                className={`border rounded-md p-3 cursor-pointer transition-all flex items-center justify-center ${
                  role === "recruiter"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setRole("recruiter")}
                data-oid="y-15ejf"
              >
                <BriefcaseBusiness
                  className={`h-5 w-5 mr-2 ${
                    role === "recruiter" ? "text-blue-500" : "text-gray-400"
                  }`}
                  data-oid="i0wboyb"
                />

                <span
                  className={
                    role === "recruiter"
                      ? "text-blue-700 font-medium"
                      : "text-gray-700"
                  }
                  data-oid="ng:er9."
                >
                  Recruiter
                </span>
              </div>
            </div>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            data-oid="681xp13"
          >
            {/* Full Name */}
            <div data-oid="dx7fl3t">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
                data-oid="kid.m78"
              >
                Full name
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="sy.6ri_"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="g9y6h.e"
                >
                  <UserIcon
                    className="h-5 w-5 text-gray-400"
                    data-oid="q-xrm0c"
                  />
                </div>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 block w-full"
                  data-oid="r:w9dtu"
                />
              </div>
            </div>

            {/* Email */}
            {role === "candidate" && (
              <div data-oid="0sf5_ki">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                  data-oid="w0o28dr"
                >
                  Email address
                </label>
                <div
                  className="mt-1 relative rounded-md shadow-sm"
                  data-oid="2s9srf1"
                >
                  <div
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    data-oid=".vx6pfq"
                  >
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      data-oid="e9d2wsz"
                    />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full"
                    data-oid="5d8p8z9"
                  />
                </div>
              </div>
            )}

            {/* Org Details for Recruiters */}
            {role === "recruiter" && (
              <>
                <div data-oid="lu7t6wn">
                  <label
                    htmlFor="orgName"
                    className="block text-sm font-medium text-gray-700"
                    data-oid="l_bh.g."
                  >
                    Organization Name
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm"
                    data-oid="332l6zh"
                  >
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      data-oid="kh9_rs3"
                    >
                      <Building2
                        className="h-5 w-5 text-gray-400"
                        data-oid="mqthdac"
                      />
                    </div>
                    <Input
                      id="orgName"
                      name="orgName"
                      placeholder="Organization Name"
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="pl-10 block w-full"
                      data-oid="b1.3ls4"
                    />
                  </div>
                </div>

                <div data-oid="jrz926_">
                  <label
                    htmlFor="orgEmail"
                    className="block text-sm font-medium text-gray-700"
                    data-oid="9uwboe2"
                  >
                    Organization Email
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm"
                    data-oid="5h:2.di"
                  >
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                      data-oid="u4i5odv"
                    >
                      <Mail
                        className="h-5 w-5 text-gray-400"
                        data-oid="i-10vwo"
                      />
                    </div>
                    <Input
                      id="orgEmail"
                      name="orgEmail"
                      placeholder="Organization Email"
                      type="email"
                      required
                      value={orgEmail}
                      onChange={(e) => setOrgEmail(e.target.value)}
                      className="pl-10 block w-full"
                      data-oid="6g2-d7y"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Phone Number */}
            <div data-oid="d6na.2w">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
                data-oid="h_.:v.a"
              >
                Phone Number
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="miw0s2f"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="gy::4uq"
                >
                  <Phone className="h-5 w-5 text-gray-400" data-oid="539d37a" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="pl-10 block w-full"
                  data-oid=".j:l:2_"
                />
              </div>
            </div>

            {/* Password */}
            <div data-oid=":mhgxyw">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
                data-oid="9tm93yc"
              >
                Password
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid="6r8zxmn"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="r5eaokp"
                >
                  <Lock className="h-5 w-5 text-gray-400" data-oid="glf3cj4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full"
                  data-oid="94fytm9"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div data-oid="qwd9bsd">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
                data-oid="f1r0c0_"
              >
                Confirm password
              </label>
              <div
                className="mt-1 relative rounded-md shadow-sm"
                data-oid=":4o1yfo"
              >
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  data-oid="kd87pqj"
                >
                  <Lock className="h-5 w-5 text-gray-400" data-oid="d3.mld8" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 block w-full"
                  data-oid="-2n9w56"
                />
              </div>
            </div>

            <div data-oid="v.ihbtz">
              <Button
                variant="blue"
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-oid="bo4t9j-"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          <div className="mt-6" data-oid="xx.dz:3">
            <p className="text-xs text-center text-gray-500" data-oid="zizdwjc">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
                data-oid="e3d5o83"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
                data-oid="vdkp1h0"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;