import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase as BriefcaseBusiness,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white md:pt-15" data-oid="7.ji:0o">
      <div className="max-w-7xl mx-auto py-12 px-4" data-oid="8qn603b">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:pl-25"
          data-oid="r5tyukg"
        >
          <div
            className="text-center md:text-left md:pr-10 p-10 md:p-0"
            data-oid="x96obex"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center md:justify-start"
              data-oid="rlfkppf"
            >
              <BriefcaseBusiness
                className="h-10 w-10 text-blue-400"
                data-oid="frlbu8a"
              />
              <span
                className="ml-2 text-2xl font-bold text-white"
                data-oid="03yi7sb"
              >
                JobHub
              </span>
            </Link>
            <p
              className="mt-8 text-gray-400 text-lg md:text-base"
              data-oid="3_vc39w"
            >
              Connecting top talent with great companies.
            </p>
            <p
              className="mt-8 ml-2 text-gray-400 text-lg md:text-base md:font-medium"
              data-oid="w2s8zj7"
            >
              Contact with us
            </p>
            <div
              className="flex justify-center md:justify-start space-x-6 mt-4"
              data-oid="f0b2.tf"
            >
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-oid="2b1ur91"
              >
                <span className="sr-only" data-oid="r-4fano">
                  Facebook
                </span>
                <Facebook className="h-6 w-6" data-oid="ytro6kq" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-oid="md6ub25"
              >
                <span className="sr-only" data-oid="lws48jg">
                  Twitter
                </span>
                <Twitter className="h-6 w-6" data-oid="8yc_kyk" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-oid="bbiml7e"
              >
                <span className="sr-only" data-oid="85sy1uf">
                  Instagram
                </span>
                <Instagram className="h-6 w-6" data-oid="fbw.:wl" />
              </a>
            </div>
          </div>

          <div className="text-center md:text-left" data-oid="iotl6wp">
            <h3
              className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400"
              data-oid="swpd56q"
            >
              For Job Seekers
            </h3>
            <ul
              className="mt-6 space-y-4 text-lg md:text-sm"
              data-oid="dsa3oz-"
            >
              <li data-oid="lii7:m6">
                <Link
                  to="/jobs"
                  className="text-gray-400 hover:text-white"
                  data-oid="u8o9hab"
                >
                  Browse Jobs
                </Link>
              </li>
              <li data-oid="3goky6s">
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white"
                  data-oid="z-c5aro"
                >
                  Create Account
                </Link>
              </li>
              <li data-oid="9rl42bx">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="r04t_x9"
                >
                  Job Alerts
                </a>
              </li>
              <li data-oid="c0c2vru">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="r1gqr6t"
                >
                  Career Advice
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left" data-oid="2143v3r">
            <h3
              className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400"
              data-oid="-2704g:"
            >
              For Employers
            </h3>
            <ul
              className="mt-6 space-y-4 text-lg md:text-sm"
              data-oid="e2br-1e"
            >
              <li data-oid="oosd4ae">
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white"
                  data-oid="kbfvr3t"
                >
                  Post a Job
                </Link>
              </li>
              <li data-oid="0x0z:ze">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="gh8x0n2"
                >
                  Browse Candidates
                </a>
              </li>
              <li data-oid="pak22nj">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="7jtbd98"
                >
                  Pricing Plans
                </a>
              </li>
              <li data-oid="ulm6cvy">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="5ov236x"
                >
                  Recruitment Tools
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left" data-oid="b6g:0tx">
            <h3
              className="text-lg md:text-base font-semibold uppercase tracking-wider text-gray-400"
              data-oid="i5.he8z"
            >
              Company
            </h3>
            <ul
              className="mt-6 space-y-4 text-lg md:text-sm"
              data-oid="z04:mv."
            >
              <li data-oid="6b.v.qp">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="144kgns"
                >
                  About Us
                </a>
              </li>
              <li data-oid="3cqxkrw">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="oup2wer"
                >
                  Contact
                </a>
              </li>
              <li data-oid="5mhjgkj">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  data-oid="n9yii4n"
                >
                  Privacy Policy
                </a>
              </li>
              <li data-oid="4ch96kb">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white "
                  data-oid="pw:hj:x"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-4" data-oid="yxyz5cv">
          <p className="text-gray-400 text-base text-center" data-oid="9avsio8">
            &copy; {new Date().getFullYear()} JobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
