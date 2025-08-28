import React from "react";
import { Link } from "react-router-dom";
import { Home, ShieldOff } from "lucide-react";
import { Button } from "../components/ui/Button";

const UnauthorizedPage = () => {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      data-oid="0mjama."
    >
      <div className="max-w-lg w-full text-center" data-oid="2ob5g97">
        <div className="flex justify-center mb-6" data-oid="0bmr_-:">
          <div className="bg-yellow-100 rounded-full p-4" data-oid="btsv71j">
            <ShieldOff
              className="h-12 w-12 text-yellow-600"
              data-oid="c4:0tu5"
            />
          </div>
        </div>

        <h1
          className="text-6xl font-bold text-gray-900 mb-4"
          data-oid="e:979q5"
        >
          403
        </h1>
        <h2
          className="text-3xl font-semibold text-gray-900 mb-4"
          data-oid="rjo13o-"
        >
          Unauthorized Access
        </h2>
        <p className="text-lg text-gray-600 mb-8" data-oid="80o48qs">
          Sorry, you don't have permission to access this page. Please check
          your credentials or contact the administrator.
        </p>

        <div className="flex justify-center space-x-4" data-oid="y5ar4tb">
          <Link to="/" data-oid="l6m8s58">
            <Button
              LeftIcon={<Home className="h-5 w-5" data-oid="s1m0r_v" />}
              data-oid="t0g2..l"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
