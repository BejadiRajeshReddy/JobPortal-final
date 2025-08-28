import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, IndianRupee, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";

const formatSalary = (salary) => {
  if (!salary || typeof salary !== "object") return "Not Disclosed";

  const { min, max, currency = "INR" } = salary;
  if (!min && !max) return "Not Disclosed";

  const formatNumber = (num) => num.toLocaleString("en-IN");

  if (min && max) {
    return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
  } else if (min) {
    return `${currency} ${formatNumber(min)}+`;
  } else {
    return `Up to ${currency} ${formatNumber(max)}`;
  }
};

const JobCard = ({ job }) => {
  // Safely access company data with fallbacks
  const companyName = job.company?.name || job.company || "Company";
  const companyLogo = job.company?.logo || null;
  
  // Get initials for company logo fallback
  const getCompanyInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CO";
  };

  return (
    <div
      className="bg-white p-4 md:p-8 rounded-lg border hover:shadow-lg border-gray-200  transition-colors duration-300 hover:border-blue-400 cursor-pointer group"
      data-oid="6n7yh4:"
    >
      {/* Card Header */}
      <div className="flex flex-col space-y-4" data-oid="oh98:mo">
        {/* Position job type badge at top-right for all screen sizes */}
        <div className="flex items-start" data-oid="4fm6af8">
          {/* Company Logo and Main Info */}
          <div className="flex gap-3 flex-1" data-oid="ccz5hgb">
            <div className="flex-shrink-0" data-oid="49c_7uq">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-12 h-12 object-contain rounded-md group-hover:scale-110 transition-transform duration-300"
                  data-oid="z_nqpua"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* Fallback company initials */}
              <div 
                className={`w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm group-hover:scale-110 transition-transform duration-300 ${companyLogo ? 'hidden' : 'flex'}`}
                data-oid="company-initials"
              >
                {getCompanyInitials(companyName)}
              </div>
            </div>
            <div className="flex-1 min-w-0" data-oid="v7fbb8x">
              <h3
                className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600"
                data-oid="gb3x1ra"
              >
                {job.title}
              </h3>
              <p
                className="text-gray-600 truncate group-hover:text-red-600 group-hover:font-medium"
                data-oid="iginb49"
              >
                {companyName}
              </p>
            </div>
          </div>

          {/* Job Type Badge - Now always visible and in top-right */}
          <span
            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap self-start"
            data-oid="afd7xfy"
          >
            {job.type}
          </span>
        </div>

        {/* Job Location, Salary, and Posted Date */}
        <div
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
          data-oid="efx8fg3"
        >
          <div className="flex items-center mr-2" data-oid="vv1b-fl">
            <MapPin className="w-4 h-4 mr-1" data-oid="oxrildy" />
            <span className="truncate" data-oid="brpxyi_">
              {job.location}
            </span>
          </div>
          <div className="flex items-center mr-2" data-oid="vqwxpum">
            <IndianRupee className="w-4 h-4 mr-1 " data-oid="sbvpk0r" />
            <span className="truncate" data-oid="sa4he9b">
              {formatSalary(job.salary)}
            </span>
          </div>
          <div className="flex items-center" data-oid="96w:ly2">
            <Clock className="w-4 h-4 mr-1" data-oid="p9i5:4:" />
            <span className="truncate" data-oid="hkir1:w">
              {job.posted}
            </span>
          </div>
          <div className="flex items-center" data-oid="u5gkfpx">
            <Briefcase className="w-4 h-4 mr-1" data-oid="vpgg0rk" />
            {job.experience}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <p className="mt-3 text-gray-600 text-sm line-clamp-2" data-oid=":89ws2n">
        {job.description}
      </p>

      {/* Skills and Action Button */}
      <div className="mt-4 space-y-4" data-oid="kh:-cib">
        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2" data-oid="0hzr4_6">
          {job.skills?.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              data-oid="ssz.eji"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 3 && (
            <span
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              data-oid="nu5xyfs"
            >
              +{job.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Button */}
        <div className="flex justify-end " data-oid="7unv9.n">
          <Link
            to={`/jobs/${job.id}`}
            className="block w-full sm:w-auto"
            data-oid="cboq66t"
          >
            <Button
              variant="blue"
              className="w-full group-hover:scale-105 transition-transform duration-300"
              data-oid="-eghece"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
