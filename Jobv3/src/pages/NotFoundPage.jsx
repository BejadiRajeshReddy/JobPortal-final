import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      data-oid="7t:4lca"
    >
      <div className="max-w-lg w-full text-center" data-oid="wnike51">
        <div className="flex justify-center mb-6" data-oid="8ts95au">
          <div className="bg-red-100 rounded-full p-4" data-oid="wtw7h3w">
            <AlertCircle
              className="h-12 w-12 text-red-600"
              data-oid="hq4es2z"
            />
          </div>
        </div>

        <h1
          className="text-6xl font-bold text-gray-900 mb-4"
          data-oid="whra7zt"
        >
          404
        </h1>
        <h2
          className="text-3xl font-semibold text-gray-900 mb-4"
          data-oid="y:chk.-"
        >
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8" data-oid="..x9xgr">
          Sorry, we couldn't find the page you're looking for. The page might
          have been removed, renamed, or doesn't exist.
        </p>

        <div className="flex justify-center space-x-4" data-oid="6shh.lt">
          <Link to="/" data-oid="6o:5q.1">
            <Button
              leftIcon={<Home className="h-5 w-5" data-oid="rh95.oo" />}
              data-oid="rbvw7zq"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
