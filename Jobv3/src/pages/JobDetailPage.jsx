import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  ArrowLeft,
  DollarSign,
  Building,
  CheckCircle2,
  BookmarkPlus,
  Share2,
  Calendar,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { sampleJobs } from "../components/job/JobList";
import jobService from "../services/jobService";

// Helper function to format salary
const formatSalary = (min, max, currency = "INR") => {
  if (!min || !max) return "Not specified";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [alreadyApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from MongoDB/localStorage
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get jobs from MongoDB first, fallback to localStorage
      const fetchedJobs = await jobService.getAllJobs();
      
      // Combine with sample jobs, avoiding duplicates
      const allJobs = [...fetchedJobs];
      const fetchedJobIds = new Set(fetchedJobs.map(j => String(j.id)));
      
      for (const job of sampleJobs) {
        if (!fetchedJobIds.has(String(job.id))) {
          allJobs.push(job);
        }
      }
      
      setJobs(allJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Using cached data.');
      
      // Fallback to localStorage only
      const localJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const allJobs = [...localJobs];
      const localJobIds = new Set(localJobs.map(j => String(j.id)));
      
      for (const job of sampleJobs) {
        if (!localJobIds.has(String(job.id))) {
          allJobs.push(job);
        }
      }
      
      setJobs(allJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [id]);

  // Refresh jobs data
  const handleRefresh = () => {
    fetchJobs();
  };

  const job = jobs.find((j) => String(j.id) === String(id));

  // Safely access company data with fallbacks
  const companyName = job?.company?.name || job?.company || "Company";
  const companyLogo = job?.company?.logo || null;
  const companyIndustry = job?.company?.industry || "Technology";
  const companyWebsite = job?.company?.website || null;
  
  // Get initials for company logo fallback
  const getCompanyInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CO";
  };

  const handleApplyClick = () => {
    // Check if user is logged in
    if (!currentUser) {
      // Redirect to login page with return URL
      navigate(`/login?returnTo=/jobs/${id}`);
      return;
    }

    // Check if user is a job seeker (not recruiter)
    if (currentUser.role === "recruiter") {
      alert(
        "Recruiters cannot apply for jobs. Please log in with a job seeker account.",
      );
      return;
    }

    setIsApplying(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (!coverLetter) {
      alert("Please write a cover letter");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically upload the file and submit the application
      // For now, we'll just simulate success
      console.log("Application submitted:", {
        jobId: job.id,
        userId: currentUser.id,
        coverLetter: coverLetter,
        submittedAt: new Date().toISOString()
      });

      // --- Add application to recruiterJobs ---
      const recruiterJobs = JSON.parse(localStorage.getItem("recruiterJobs") || "[]");
      const jobIdx = recruiterJobs.findIndex(j => j.id === job.id || j.id === String(job.id));
      if (jobIdx !== -1) {
        recruiterJobs[jobIdx].applicants = recruiterJobs[jobIdx].applicants || [];
        recruiterJobs[jobIdx].applicants.push({
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          coverLetter,
          appliedAt: new Date().toISOString()
        });
        localStorage.setItem("recruiterJobs", JSON.stringify(recruiterJobs));
      }
      // --- Add application to jobs (for candidate view) ---
      const jobsList = JSON.parse(localStorage.getItem("jobs") || "[]");
      const jobIdx2 = jobsList.findIndex(j => j.id === job.id || j.id === String(job.id));
      if (jobIdx2 !== -1) {
        jobsList[jobIdx2].applicants = jobsList[jobIdx2].applicants || [];
        jobsList[jobIdx2].applicants.push({
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          coverLetter,
          appliedAt: new Date().toISOString()
        });
        localStorage.setItem("jobs", JSON.stringify(jobsList));
      }

      setHasApplied(true);
      setIsSubmitting(false);
      setIsApplying(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading job details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">{error}</p>
          </div>
          <Link
            to="/jobs"
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        data-oid="992:qx."
      >
        <div className="text-center" data-oid="lf9_xtp">
          <h2 className="text-2xl font-bold text-gray-900" data-oid="_o5fnta">
            Job not found
          </h2>
          <Link
            to="/jobs"
            className="mt-4 text-blue-600 hover:text-blue-500"
            data-oid="s6j:38-"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      data-oid="ypnqzi1"
    >
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/jobs"
          className="flex items-center text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-oid="gw3ckw5">
        <div className="lg:col-span-2" data-oid="_q2vw0_">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            data-oid="1i4wv4."
          >
            {/* Job Header */}
            <div className="p-6 border-b border-gray-200" data-oid="blgvsk3">
              <div className="flex items-start gap-4" data-oid="_fz8wjd">
                <div className="flex-shrink-0" data-oid="hrgg-k0">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-16 h-16 object-cover rounded-md"
                      data-oid="lhb1cbn"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback company initials */}
                  <div 
                    className={`w-16 h-16 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg ${companyLogo ? 'hidden' : 'flex'}`}
                    data-oid="company-initials-header"
                  >
                    {getCompanyInitials(companyName)}
                  </div>
                </div>
                <div className="flex-1 min-w-0" data-oid="ixw1apw">
                  <h1
                    className="text-2xl font-bold text-gray-900"
                    data-oid="3nu8g4p"
                  >
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-gray-600" data-oid="wmc.6ab">
                    {companyName}
                  </p>

                  <div
                    className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500"
                    data-oid="0vma353"
                  >
                    <div className="flex items-center" data-oid="andil3k">
                      <MapPin className="h-4 w-4 mr-1" data-oid="8.bbs01" />
                      {job.location}
                    </div>
                    <div className="flex items-center" data-oid="1a0fr4j">
                      <Briefcase className="h-4 w-4 mr-1" data-oid="95xnn5t" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center" data-oid="2pnvhcx">
                        {/* <IndianRupee className="h-4 w-4 mr-1" /> */}
                        {formatSalary(
                          job.salary.min,
                          job.salary.max,
                          job.salary.currency,
                        )}
                      </div>
                    )}
                    <div className="flex items-center" data-oid="ap:gy8:">
                      <Clock className="h-4 w-4 mr-1" data-oid="r8r3l0g" />
                      Posted {formatDate(job.postedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="p-6" data-oid="_0c67b4">
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                data-oid="ycs9dog"
              >
                Job Description
              </h2>
              <p
                className="text-gray-700 whitespace-pre-line"
                data-oid="_g5yvn9"
              >
                {job.description}
              </p>

              <h2
                className="text-xl font-semibold text-gray-900 mt-8 mb-4"
                data-oid="fyrdjoo"
              >
                Requirements
              </h2>
              <ul
                className="list-disc pl-5 space-y-2 text-gray-700"
                data-oid="e-p_3c2"
              >
                {job.requirements?.map((req, index) => (
                  <li key={index} data-oid="unjfji2">
                    {req}
                  </li>
                )) || (
                  <li className="text-gray-500 italic">No specific requirements listed</li>
                )}
              </ul>

              <h2
                className="text-xl font-semibold text-gray-900 mt-8 mb-4"
                data-oid="bh16yap"
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2" data-oid="ms77gnn">
                {job.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    data-oid="a--20ra"
                  >
                    {skill}
                  </span>
                )) || (
                  <span className="text-gray-500 italic">No specific skills listed</span>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div
              className="p-6 border-t border-gray-200 bg-gray-50"
              data-oid="6bhersk"
            >
              <h2
                className="text-xl font-semibold text-gray-900 mb-4"
                data-oid="oi-:8nw"
              >
                About the Company
              </h2>
              <div className="flex items-start gap-4" data-oid="gpl1diw">
                <div className="flex-shrink-0" data-oid="ua3d8jp">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-16 h-16 object-cover rounded-md"
                      data-oid="8rghfaf"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback company initials */}
                  <div 
                    className={`w-16 h-16 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg ${companyLogo ? 'hidden' : 'flex'}`}
                    data-oid="company-initials-info"
                  >
                    {getCompanyInitials(companyName)}
                  </div>
                </div>
                <div data-oid="fh9s76h">
                  <h3
                    className="text-lg font-medium text-gray-900"
                    data-oid="z_rfmuj"
                  >
                    {companyName}
                  </h3>
                  <div
                    className="mt-2 flex items-center text-sm text-gray-500"
                    data-oid="a-gqab7"
                  >
                    <Building className="h-4 w-4 mr-1" data-oid="swfjjao" />
                    {companyIndustry}
                  </div>
                  <div
                    className="mt-1 flex items-center text-sm text-gray-500"
                    data-oid="k10roa_"
                  >
                    <MapPin className="h-4 w-4 mr-1" data-oid="yj6zer9" />
                    {job.location}
                  </div>
                  {companyWebsite && (
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      data-oid="n35mdze"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Sidebar */}
        <div className="lg:col-span-1" data-oid="6u5cbn_">
          <div
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20"
            data-oid="et87m85"
          >
            {alreadyApplied || hasApplied ? (
              <div className="text-center py-4" data-oid="all988s">
                <div
                  className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4"
                  data-oid="yb_asid"
                >
                  <CheckCircle2 className="h-8 w-8" data-oid="tvt4m.g" />
                </div>
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  data-oid="2kh6dh3"
                >
                  Application Submitted
                </h3>
                <p className="text-gray-600 mb-4" data-oid="-gsatdr">
                  Your application has been successfully submitted. Good luck!
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate("/jobs")}
                  data-oid="u.l1z97"
                >
                  Browse More Jobs
                </Button>
              </div>
            ) : isApplying ? (
              <div data-oid="5bxxvpq">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-4"
                  data-oid="kn2doyf"
                >
                  Apply for this position
                </h3>
                <form onSubmit={handleApplySubmit} data-oid="qg5op9r">
                  <div className="mb-4" data-oid="3:r4zc1">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      data-oid="zgsje4w"
                    >
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                      placeholder="Tell the employer why you're a great fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      data-oid="ja_s6_d"
                    />
                  </div>
                  <div className="flex space-x-2" data-oid="u:4fu-y">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting || !coverLetter}
                      data-oid="vvz.eqk"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsApplying(false);
                        setCoverLetter("");
                      }}
                      data-oid="j1-j4z."
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h3
                  className="text-xl font-semibold text-gray-900 mb-4"
                  data-oid=".eg75wz"
                >
                  Job Summary
                </h3>
                <div className="space-y-4 mb-6" data-oid="6ecd7:c">
                  {job.deadline && (
                    <div className="flex items-start" data-oid="kprvye:">
                      <Calendar
                        className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                        data-oid="h5cf-6o"
                      />
                      <div data-oid="yhselgt">
                        <p
                          className="text-sm font-medium text-gray-700"
                          data-oid="gyhdese"
                        >
                          Application Deadline
                        </p>
                        <p className="text-sm text-gray-600" data-oid="sz.xz7p">
                          {formatDate(job.deadline)}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start" data-oid="5_7l8jh">
                    <Clock
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="m:kt01j"
                    />
                    <div data-oid="ato4_2u">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="999rg79"
                      >
                        Posted Date
                      </p>
                      <p className="text-sm text-gray-600" data-oid="hy-pwys">
                        {formatDate(job.postedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start" data-oid="0a:2zk7">
                    <Briefcase
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="aorxo:e"
                    />
                    <div data-oid="f:3k5ja">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="bgy7fjf"
                      >
                        Job Type
                      </p>
                      <p className="text-sm text-gray-600" data-oid="fe:pp3m">
                        {job.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start" data-oid="3ej2ui:">
                    <MapPin
                      className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                      data-oid="u9wtjoe"
                    />
                    <div data-oid="t2ap.wq">
                      <p
                        className="text-sm font-medium text-gray-700"
                        data-oid="pkh8p:a"
                      >
                        Location
                      </p>
                      <p className="text-sm text-gray-600" data-oid=".w4n:_j">
                        {job.location}
                      </p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-start" data-oid="zls7pjc">
                      <IndianRupee
                        className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                        data-oid="si5-4z-"
                      />
                      <div data-oid="qi63cuo">
                        <p
                          className="text-sm font-medium text-gray-700"
                          data-oid="76w.4-5"
                        >
                          Salary Range
                        </p>
                        <p className="text-sm text-gray-600" data-oid="hv1sqiz">
                          {formatSalary(
                            job.salary.min,
                            job.salary.max,
                            job.salary.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Login prompt for non-logged in users */}
                {!currentUser ? (
                  <div
                    className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
                    data-oid="cifg5rw"
                  >
                    <p
                      className="text-sm text-blue-700 mb-3"
                      data-oid="8-pup1k"
                    >
                      Please log in to apply for this job
                    </p>
                    <div className="flex space-x-2" data-oid="pn5p41.">
                      <Link
                        to={`/login?returnTo=/jobs/${id}`}
                        className="flex-1"
                        data-oid="exff.xk"
                      >
                        <Button variant="blue" fullWidth data-oid="cvrka1h">
                          Login to Apply
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        className="flex-1"
                        data-oid="71xso:q"
                      >
                        <Button variant="outline" fullWidth data-oid="sztphw9">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : currentUser.role === "recruiter" ? (
                  <div
                    className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
                    data-oid="v5-:k1f"
                  >
                    <p className="text-sm text-yellow-700" data-oid="ix35ftu">
                      Recruiters cannot apply for jobs. Please log in with a job
                      seeker account.
                    </p>
                  </div>
                ) : (
                  <Button
                    fullWidth
                    onClick={handleApplyClick}
                    className="mb-3"
                    data-oid="3ri0bgw"
                  >
                    Apply Now
                  </Button>
                )}

                <div className="flex space-x-2" data-oid="0aotufp">
                  <Button
                    variant="outline"
                    className="flex-1"
                    leftIcon={
                      <BookmarkPlus className="h-4 w-4" data-oid="7ne90um" />
                    }
                    data-oid="2iv8i33"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    leftIcon={<Share2 className="h-4 w-4" data-oid="m.vmo28" />}
                    data-oid="qhd1aey"
                  >
                    Share
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;