import { Briefcase, Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import Logo from "../ui/Logo";
import AnimatedBriefcase from "../ui/Logo";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check and update user state
    const checkUserState = () => {
      try {
        const user = localStorage.getItem("currentUser");
        if (user) {
          setCurrentUser(JSON.parse(user));
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check user state immediately
    checkUserState();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        checkUserState();
      }
    };

    // Listen for custom events (when user logs in/out in same tab)
    const handleUserChange = () => {
      checkUserState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userStateChanged", handleUserChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChanged", handleUserChange);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("userStateChanged"));

    navigate("/");
    setMobileMenuOpen(false);
  };

  const handlePostJobClick = () => {
    if (currentUser?.role === "recruiter") {
      navigate("/dashboard");
      handleClick();
    } else {
      // Redirect non-recruiters to register as recruiter
      navigate("/register?role=recruiter");
    }
    setMobileMenuOpen(false);
  };

  // Don't render auth buttons while loading
  if (isLoading) {
    return (
      <nav
        className="bg-gray-50 sticky top-0 z-50 shadow-sm rounded-md"
        data-oid="yalpz8j"
      >
        <div
          className="max-w-7xl px-4 sm:px-6 lg:px-8"
          data-oid="qu-hme-"
        >
          <div
            className="flex justify-between items-center h-16"
            data-oid="eewcbom"
          >
            <div className="flex items-center" data-oid="mq9h71-">
              <Link
                to="/"
                className="flex items-center"
                onClick={handleClick}
                data-oid="cdb.k25"
              >
                <AnimatedBriefcase data-oid="cylnj83" />
                <span
                  className="ml-4 text-xl font-bold text-gray-900 hover:scale-120 transition ease-in-out duration-500"
                  data-oid="ys3on:y"
                >
                  JobHub
                </span>
              </Link>
              <div
                className="hidden md:flex md:ml-6 md:space-x-4"
                data-oid="qayhe60"
              >
                <Link
                  to="/jobs"
                  onClick={handleClick}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 rounded-md transition  hover:scale-110"
                  data-oid="c6ktoj."
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
            <div className="flex items-center" data-oid="strhjdh">
              <div
                className="hidden md:flex md:items-center md:space-x-4"
                data-oid="x0k1q1w"
              >
                <div
                  className="animate-pulse bg-gray-200 h-9 w-20 rounded"
                  data-oid="bjkjkt4"
                ></div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="ml-2 md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                data-oid="ed3t05u"
              >
                <Menu className="h-6 w-6 text-gray-700" data-oid="vefza18" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="bg-gray-50 sticky top-0 z-50 shadow-sm rounded-md"
      data-oid="tvq0t7q"
    >
      <div
        className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10"
        data-oid="81_2pvp"
      >
        <div
          className="flex justify-between items-center h-16"
          data-oid="i7xg8ks"
        >
          {/* Logo + Desktop Links */}
          <div className="flex items-center" data-oid="g26rih:">
            <Link
              to="/"
              className="flex items-center"
              onClick={handleClick}
              data-oid="3r9xpyp"
            >
              <AnimatedBriefcase data-oid="-tx_jwt" />
              <span
                className="ml-4 text-xl lg:text-2xl font-bold text-gray-900 hover:scale-120 transition ease-in-out duration-500"
                data-oid="ura8x-m"
              >
                JobHub
              </span>
            </Link>
            <div
              className="hidden md:flex md:ml-6 md:space-x-4"
              data-oid="._yg7ky"
            >
              <Link
                to="/jobs"
                onClick={handleClick}
                className="px-3 py-2 text-sm lg:text-base font-medium text-gray-600 hover:text-gray-700 rounded-md transition  hover:scale-110"
                data-oid="utmtd.h"
              >
                Browse Jobs
              </Link>
              {/* Only show Post a Job for recruiters */}
              {currentUser && currentUser.role === "recruiter" && (
                <button
                  onClick={handlePostJobClick}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-gray-600 hover:text-gray-700 rounded-md transition hover:scale-110"
                  data-oid="hb0e6zn"
                >
                  Post a Job
                </button>
              )}
            </div>
          </div>

          {/* Auth Buttons (desktop) + Mobile Hamburger */}
          <div className="flex items-center" data-oid="0fietfk">
            {/* desktop auth */}
            <div
              className="hidden md:flex md:items-center md:space-x-4"
              data-oid="hnocdu6"
            >
              {currentUser ? (
                <div className="flex items-center space-x-4" data-oid="lo2xt49">
                  <div
                    className="flex items-center space-x-2"
                    data-oid="8it-0::"
                  >
                    <User
                      className="h-5 w-5 text-gray-600"
                      data-oid="htdfd0:"
                    />
                    <span
                      className="text-sm font-medium text-gray-700"
                      data-oid="xzp8q8s"
                    >
                      {currentUser.name}
                    </span>
                  </div>
                  <Link 
                    to={currentUser.role === "recruiter" ? "/dashboard" : "/profile"} 
                    onClick={handleClick} 
                    data-oid="skpcai_"
                  >
                    <Button
                      variant="blue"
                      className="flex items-center space-x-2"
                      data-oid="nkxindd"
                    >
                      <User className="h-4 w-4" data-oid="di0_1d-" />
                      <span data-oid="0zac2tg">
                        {currentUser.role === "recruiter" ? "Dashboard" : "Profile"}
                      </span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                    data-oid="hewkv:2"
                  >
                    <LogOut className="h-4 w-4" data-oid="wdcvdre" />
                    <span data-oid="3euecrk">Logout</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={handleClick} data-oid="4..b7ak">
                    <Button variant="blue" data-oid="9aaznyh" className="lg:text-base">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={handleClick} data-oid="ybjst32" >
                    <Button variant="danger" data-oid="zjjx_qz" className="lg:text-base">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
            {/* mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="ml-2 md:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              data-oid="zvxgn1_"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" data-oid="wq11jie" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" data-oid="gdn5mkj" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-200"
          data-oid="26d1ef:"
        >
          <div className="px-2 pt-2 pb-3 space-y-1" data-oid="qtqd-25">
            <Link
              to="/jobs"
              onClick={toggleMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              data-oid="hiwe1k9"
            >
              Browse Jobs
            </Link>
            {/* Only show Post a Job for recruiters */}
            {currentUser && currentUser.role === "recruiter" && (
              <button
                onClick={handlePostJobClick}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                data-oid="bo1:0j5"
              >
                Post a Job
              </button>
            )}

            {currentUser ? (
              <div className="px-3 py-2 space-y-3" data-oid="-j2afl8">
                <div
                  className="flex items-center space-x-2 text-gray-700"
                  data-oid="qw8dk2v"
                >
                  <User className="h-5 w-5" data-oid="u9_e3qo" />
                  <span className="font-medium" data-oid="18ahtl3">
                    {currentUser.name}
                  </span>
                </div>
                <Link
                  to={currentUser.role === "recruiter" ? "/dashboard" : "/profile"}
                  onClick={toggleMobileMenu}
                  className="w-full"
                  data-oid="65rgk26"
                >
                  <Button
                    variant="blue"
                    className="w-full flex items-center justify-center space-x-2"
                    data-oid="0i:hnbo"
                  >
                    <User className="h-4 w-4" data-oid="jefl96-" />
                    <span data-oid="ejl24vg">
                      {currentUser.role === "recruiter" ? "Dashboard" : "Profile"}
                    </span>
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                  data-oid="tc9ag0j"
                >
                  <LogOut className="h-4 w-4" data-oid="3bdk-w." />
                  <span data-oid="yfoxe-f">Logout</span>
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col space-y-2 mt-4 px-4"
                data-oid=".-62:7f"
              >
                <Button
                  onClick={() => {
                    navigate("/login");
                    toggleMobileMenu();
                  }}
                  variant="blue"
                  data-oid="bj2tz9a"
                >
                  Login
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    navigate("/register");
                    toggleMobileMenu();
                  }}
                  data-oid="ynd:_39"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;