import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Users,
  Briefcase,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  Building,
  Mail,
  Phone,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Settings,
  DollarSign,
  MapPinIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import jobService from "../services/jobService";

// Job Service is now imported from the service file

const RecruiterDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    salary: {
      min: "",
      max: "",
      currency: "INR"
    },
    experience: "",
    skills: "",
    benefits: "",
    deadline: ""
  });
  const [profileModal, setProfileModal] = useState({ open: false, profile: null });
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== "recruiter") {
        navigate("/profile");
        return;
      }
      setCurrentUser(userData);
      loadJobs(userData.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const loadJobs = async (recruiterId) => {
    try {
      console.log("🔄 Loading jobs for recruiter ID:", recruiterId);
      const response = await jobService.getJobList(recruiterId);
      console.log("📥 API Response:", response);
      
      // Handle different response structures
      let jobsData = [];
      if (response && response.result) {
        jobsData = response.result;
      } else if (response && response.data) {
        jobsData = response.data;
      } else if (response && Array.isArray(response)) {
        jobsData = response;
      } else if (response && response.message) {
        console.log("API returned message:", response.message);
        jobsData = [];
      } else {
        console.log("No jobs data found in response");
        jobsData = [];
      }
      
      console.log("📋 Processed jobs data:", jobsData);
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      
      // Also save to localStorage as backup
      const allJobs = JSON.parse(localStorage.getItem("recruiterJobs") || "[]");
      const updatedJobs = allJobs.filter(job => job.recruiterId !== recruiterId);
      updatedJobs.push(...jobsData);
      localStorage.setItem("recruiterJobs", JSON.stringify(updatedJobs));
      
    } catch (error) {
      console.error("❌ Error loading jobs:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        recruiterId: recruiterId
      });
      
      // Fallback to localStorage if API fails
      console.log("🔄 Falling back to localStorage...");
    const allJobs = JSON.parse(localStorage.getItem("recruiterJobs") || "[]");
    const userJobs = allJobs.filter(job => job.recruiterId === recruiterId);
      console.log("📋 Found jobs in localStorage:", userJobs);
    setJobs(userJobs);
    setFilteredJobs(userJobs);
    }
  };

  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Check if user is authenticated
              const token = jobService.getAuthToken();
        if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      console.log("👤 Current user:", currentUser);
      console.log("🎫 Auth token:", token ? "Present" : "Missing");

      // Prepare job data for API
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        requirements: jobForm.requirements.split("\n").filter(req => req.trim()),
        location: jobForm.location,
        type: jobForm.type,
        salary: jobForm.salary,
        experience: jobForm.experience,
        skills: jobForm.skills.split(",").map(skill => skill.trim()).filter(Boolean),
        benefits: jobForm.benefits.split("\n").filter(benefit => benefit.trim()),
        deadline: jobForm.deadline,
        recruiterId: currentUser.id,
        company: currentUser.company?.name || currentUser.company,
        status: "active",
        postedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("Job data to submit:", jobData);

      if (editingJob) {
        // Update existing job
        jobData.id = editingJob.id;
        jobData.applicants = editingJob.applicants || [];
        console.log("Updating job with ID:", editingJob.id);
        await jobService.updateJob(jobData);
      } else {
        // Insert new job
        console.log("Inserting new job");
        await jobService.insertJob(jobData);
      }

      // Reload jobs after successful submission
      await loadJobs(currentUser.id);
      resetForm();
      
      // Show success message
      alert(editingJob ? "Job updated successfully!" : "Job posted successfully!");
      
    } catch (error) {
      console.error("Error submitting job:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        currentUser: currentUser,
        token: jobService.getAuthToken() ? "Present" : "Missing"
      });
      
      setSubmitError(error.message || "Failed to submit job. Please try again.");
      
      // Fallback to localStorage if API fails
      console.log("Falling back to localStorage...");
    const newJob = {
      id: editingJob ? editingJob.id : Date.now().toString(),
      ...jobForm,
      recruiterId: currentUser.id,
      company: currentUser.company,
      status: "active",
      applicants: editingJob ? editingJob.applicants : [],
      postedAt: editingJob ? editingJob.postedAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skills: jobForm.skills.split(",").map(skill => skill.trim()).filter(Boolean),
      requirements: jobForm.requirements.split("\n").filter(req => req.trim()),
      benefits: jobForm.benefits.split("\n").filter(benefit => benefit.trim()),
    };

    const allJobs = JSON.parse(localStorage.getItem("recruiterJobs") || "[]");
    
    if (editingJob) {
      const jobIndex = allJobs.findIndex(job => job.id === editingJob.id);
      if (jobIndex !== -1) {
        allJobs[jobIndex] = newJob;
      }
    } else {
      allJobs.push(newJob);
    }

    localStorage.setItem("recruiterJobs", JSON.stringify(allJobs));
    
    // ALSO save to jobs for candidates to see
    const allPublicJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    if (editingJob) {
      const idx = allPublicJobs.findIndex(job => job.id === newJob.id);
      if (idx !== -1) {
        allPublicJobs[idx] = newJob;
      }
    } else {
      allPublicJobs.push(newJob);
    }
    localStorage.setItem("jobs", JSON.stringify(allPublicJobs));
    
    loadJobs(currentUser.id);
    resetForm();
      alert("Job saved locally (API unavailable). Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setJobForm({
      title: "",
      description: "",
      requirements: "",
      location: "",
      type: "full-time",
      salary: {
        min: "",
        max: "",
        currency: "INR"
      },
      experience: "",
      skills: "",
      benefits: "",
      deadline: ""
    });
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      ...job,
      skills: job.skills?.join(", ") || "",
      requirements: job.requirements?.join("\n") || "",
      benefits: job.benefits?.join("\n") || "",
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await jobService.deleteJob(jobId);
        loadJobs(currentUser.id);
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const toggleJobStatus = async (jobId) => {
    try {
      const allJobs = JSON.parse(localStorage.getItem("recruiterJobs") || "[]");
      const jobIndex = allJobs.findIndex(job => job.id === jobId);
      
      if (jobIndex !== -1) {
        const updatedJob = {
          ...allJobs[jobIndex],
          status: allJobs[jobIndex].status === "active" ? "paused" : "active"
        };
        
        await jobService.updateJob(updatedJob);
        loadJobs(currentUser.id);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status. Please try again.');
    }
  };

  const getJobStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === "active").length;
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
    const recentJobs = jobs.filter(job => {
      const postedDate = new Date(job.postedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postedDate > weekAgo;
    }).length;

    return { totalJobs, activeJobs, totalApplicants, recentJobs };
  };

  const formatSalary = (salary) => {
    if (!salary || !salary.min || !salary.max) return "Not specified";
    return `₹${parseInt(salary.min).toLocaleString()} - ₹${parseInt(salary.max).toLocaleString()}`;
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  // Helper to fetch candidate profile from localStorage
  const getCandidateProfile = (userId) => {
    const profiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
    return profiles[userId] || null;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getJobStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Company Logo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {currentUser.company?.logo ? (
                    <img
                      src={currentUser.company.logo}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {getInitials(currentUser.company?.name || currentUser.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1 text-white">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {currentUser.company?.name || "Your Company"}
                  </h1>
                  <p className="text-xl text-blue-100 mb-4">
                    Recruiter Dashboard
                  </p>
                  <div className="flex flex-wrap gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">
                        {currentUser.company?.email || currentUser.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">
                        {currentUser.company?.industry || "Technology"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {currentUser.company?.location || "Remote"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalApplicants}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-orange-600">{stats.recentJobs}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            <Button
              onClick={() => setActiveTab('overview')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Job Management
            </Button>
            <Button
              onClick={() => setActiveTab('applications')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'applications' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5 mr-3" />
              Applications
            </Button>
            <Button
              onClick={() => setActiveTab('analytics')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Job Management Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Management</h2>
                  <p className="text-gray-600">Create, edit, and manage your job postings</p>
                </div>
                                 <div className="flex gap-3">
                   <Button
                     onClick={async () => {
                       const isConnected = await jobService.testConnection();
                       alert(isConnected ? 'API Connection: OK' : 'API Connection: Failed');
                     }}
                     variant="outline"
                     className="px-4 py-3"
                   >
                     Test API
                   </Button>
                   <Button
                     onClick={async () => {
                       try {
                         // Test job insertion with current user
                         const testJobData = {
                           title: "Test Job - " + new Date().toISOString(),
                           description: "This is a test job for debugging",
                           requirements: ["Test requirement 1", "Test requirement 2"],
                           location: "Test Location",
                           type: "full-time",
                           salary: {
                             min: "300000",
                             max: "500000",
                             currency: "INR"
                           },
                           experience: "2-4 years",
                           skills: ["React", "JavaScript", "Node.js"],
                           benefits: ["Health Insurance", "Remote Work"],
                           deadline: "2024-12-31",
                           recruiterId: currentUser.id,
                           company: currentUser.company?.name || currentUser.company,
                           status: "active",
                           postedAt: new Date().toISOString(),
                           updatedAt: new Date().toISOString()
                         };
                         
                         await jobService.insertJob(testJobData);
                         alert('Test job insertion successful! Check console for details.');
                         // Refresh jobs after test insertion
                         loadJobs(currentUser.id);
                       } catch (error) {
                         alert('Test job insertion failed: ' + error.message);
                       }
                     }}
                     variant="outline"
                     className="px-4 py-3"
                   >
                     Test Job Insert
                   </Button>
                   <Button
                     onClick={() => {
                       console.log("🔄 Manual refresh triggered");
                       if (currentUser) {
                         loadJobs(currentUser.id);
                       }
                     }}
                     variant="outline"
                     className="px-4 py-3"
                   >
                     Refresh Jobs
                   </Button>
                   <Button
                     onClick={async () => {
                       try {
                         const allJobs = await jobService.getAllJobs();
                         console.log('🔍 All jobs in MongoDB/localStorage:', allJobs);
                         alert('Check console for all jobs. Found: ' + allJobs.length);
                       } catch (error) {
                         alert('Error checking jobs: ' + error.message);
                       }
                     }}
                     variant="outline"
                     className="px-4 py-3"
                   >
                     Check All Jobs
                   </Button>
                <Button
                  onClick={() => setShowJobForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Post New Job
                </Button>
                 </div>
              </div>

              {/* Search and Filters */}
              <div className="mt-8 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search jobs by title or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-base"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    {jobs.length === 0 
                      ? "Start by posting your first job to attract candidates"
                      : "Try adjusting your search or filter criteria"
                    }
                  </p>
                  {jobs.length === 0 && (
                    <Button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Post Your First Job
                    </Button>
                  )}
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.type}
                              </div>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                {formatSalary(job.salary)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Posted {new Date(job.postedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : job.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills?.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applicants?.length || 0} applicants
                          </div>
                          {job.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                          onClick={() => handleEditJob(job)}
                          variant="outline"
                          className="w-full"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => toggleJobStatus(job.id)}
                          variant="outline"
                          className="w-full"
                        >
                          {job.status === 'active' ? (
                            <>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDeleteJob(job.id)}
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Applications Management</h3>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Posted</h3>
                <p className="text-gray-600">Post a job to start receiving applications.</p>
              </div>
            ) : jobs.every(job => !job.applicants || job.applicants.length === 0) ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">You haven't received any applications yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Applicant Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Applied At</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Profile</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Cover Letter</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map(job => (
                      (job.applicants || []).map((app, idx) => (
                        <tr key={job.id + '-' + (app.userId || idx)}>
                          <td className="px-4 py-2 font-semibold text-gray-900 whitespace-nowrap">{job.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{app.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{app.email}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{app.appliedAt ? new Date(app.appliedAt).toLocaleString() : ''}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                const profile = getCandidateProfile(app.userId);
                                setProfileModal({ open: true, profile });
                              }}
                              disabled={!app.userId}
                            >
                              View Profile
                            </button>
                          </td>
                          <td className="px-4 py-2 max-w-xs truncate" title={app.coverLetter}>{app.coverLetter ? app.coverLetter : 'N/A'}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Profile Modal */}
            {profileModal.open && profileModal.profile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={() => setProfileModal({ open: false, profile: null })}
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center mb-6">
                    {profileModal.profile.profilePicture?.url ? (
                      <img src={profileModal.profile.profilePicture.url} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-2" />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-2">
                        {profileModal.profile.fullName?.[0] || 'U'}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold mb-1">{profileModal.profile.fullName || profileModal.profile.name || 'N/A'}</h2>
                    <p className="text-gray-600 mb-1">{profileModal.profile.jobTitle || 'N/A'}</p>
                    <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-2">
                      <span>{profileModal.profile.email || 'N/A'}</span>
                      {profileModal.profile.phone && <span>{profileModal.profile.phone}</span>}
                      {profileModal.profile.location && <span>{profileModal.profile.location}</span>}
                    </div>
                  </div>
                  {/* Social Links */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Social Links</h3>
                    <div className="flex flex-wrap gap-4">
                      {profileModal.profile.socialLinks?.linkedin && <a href={profileModal.profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                      {profileModal.profile.socialLinks?.github && <a href={profileModal.profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>}
                      {profileModal.profile.socialLinks?.portfolio && <a href={profileModal.profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Portfolio</a>}
                      {profileModal.profile.socialLinks?.website && <a href={profileModal.profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Website</a>}
                      {!(profileModal.profile.socialLinks?.linkedin || profileModal.profile.socialLinks?.github || profileModal.profile.socialLinks?.portfolio || profileModal.profile.socialLinks?.website) && <span className="text-gray-400">No social links</span>}
                    </div>
                  </div>
                  {/* About Me */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">About Me</h3>
                    <p className="text-gray-700 whitespace-pre-line">{profileModal.profile.aboutMe || 'N/A'}</p>
                  </div>
                  {/* Experience */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Experience</h3>
                    {Array.isArray(profileModal.profile.experience) && profileModal.profile.experience.length > 0 ? (
                      <ul className="space-y-2">
                        {profileModal.profile.experience.map((exp, i) => (
                          <li key={i} className="border-b pb-2">
                            <div className="font-semibold">{exp.title || 'N/A'} <span className="text-blue-600">@ {exp.company || 'N/A'}</span></div>
                            <div className="text-sm text-gray-500">{exp.location ? exp.location + ', ' : ''}{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.description && <div className="text-gray-700 text-sm mt-1">{exp.description}</div>}
                          </li>
                        ))}
                      </ul>
                    ) : <div className="text-gray-400">No experience added</div>}
                  </div>
                  {/* Education */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Education</h3>
                    {Array.isArray(profileModal.profile.education) && profileModal.profile.education.length > 0 ? (
                      <ul className="space-y-2">
                        {profileModal.profile.education.map((edu, i) => (
                          <li key={i} className="border-b pb-2">
                            <div className="font-semibold">{edu.degree || 'N/A'} <span className="text-green-600">@ {edu.institution || 'N/A'}</span></div>
                            <div className="text-sm text-gray-500">{edu.location ? edu.location + ', ' : ''}{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                            {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                            {edu.description && <div className="text-gray-700 text-sm mt-1">{edu.description}</div>}
                          </li>
                        ))}
                      </ul>
                    ) : <div className="text-gray-400">No education added</div>}
                  </div>
                  {/* Skills */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Skills</h3>
                    {Array.isArray(profileModal.profile.skills) && profileModal.profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profileModal.profile.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{s.name || s}</span>
                        ))}
                      </div>
                    ) : <div className="text-gray-400">No skills added</div>}
                  </div>
                  {/* Projects */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Projects</h3>
                    {Array.isArray(profileModal.profile.projects) && profileModal.profile.projects.length > 0 ? (
                      <ul className="space-y-2">
                        {profileModal.profile.projects.map((proj, i) => (
                          <li key={i} className="border-b pb-2">
                            <div className="font-semibold">{proj.title || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{proj.startDate} - {proj.current ? 'Present' : proj.endDate}</div>
                            {proj.technologies && <div className="text-xs text-gray-500">Tech: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>}
                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">GitHub</a>}
                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs ml-2">Live</a>}
                            {proj.description && <div className="text-gray-700 text-sm mt-1">{proj.description}</div>}
                            {proj.highlights && Array.isArray(proj.highlights) && proj.highlights.length > 0 && (
                              <ul className="list-disc ml-5 text-xs text-gray-600 mt-1">
                                {proj.highlights.map((h, j) => <li key={j}>{h}</li>)}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : <div className="text-gray-400">No projects added</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track job performance and recruitment metrics
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This feature will be available soon
              </p>
            </div>
          </div>
        )}

        {/* Optimized Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
                    </h2>
                    <p className="text-gray-600">
                      Fill in the details below to {editingJob ? "update" : "create"} your job posting
                    </p>
                  </div>
                  <Button
                    onClick={resetForm}
                    variant="ghost"
                    className="p-3 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <form onSubmit={handleJobSubmit} className="space-y-8">
                  {/* Section 1: Basic Job Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Basic Job Information</h3>
                        <p className="text-sm text-gray-600">Essential details about the position</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <Input
                          value={jobForm.title}
                          onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                          placeholder="e.g. Senior Frontend Developer"
                          required
                          className="text-base h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Job Type *
                        </label>
                        <Select value={jobForm.type} onValueChange={(value) => setJobForm({...jobForm, type: value})}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Description *
                      </label>
                      <textarea
                        value={jobForm.description}
                        onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                        placeholder="Provide a comprehensive description of the role, responsibilities, and what makes this position exciting..."
                        required
                        rows={5}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                      />
                    </div>
                  </div>

                  {/* Section 2: Location & Schedule */}
                  <div className="bg-green-50 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <MapPinIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Location & Schedule</h3>
                        <p className="text-sm text-gray-600">Where and when the work happens</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Work Location *
                        </label>
                        <Input
                          value={jobForm.location}
                          onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                          placeholder="e.g. Mumbai, India or Remote"
                          required
                          className="text-base h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Application Deadline
                        </label>
                        <Input
                          type="date"
                          value={jobForm.deadline}
                          onChange={(e) => setJobForm({...jobForm, deadline: e.target.value})}
                          className="text-base h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Compensation & Experience */}
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Compensation & Experience</h3>
                        <p className="text-sm text-gray-600">Salary range and experience requirements</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Minimum Salary (₹)
                        </label>
                        <Input
                          type="number"
                          value={jobForm.salary.min}
                          onChange={(e) => setJobForm({
                            ...jobForm, 
                            salary: {...jobForm.salary, min: e.target.value}
                          })}
                          placeholder="300000"
                          className="text-base h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Maximum Salary (₹)
                        </label>
                        <Input
                          type="number"
                          value={jobForm.salary.max}
                          onChange={(e) => setJobForm({
                            ...jobForm, 
                            salary: {...jobForm.salary, max: e.target.value}
                          })}
                          placeholder="500000"
                          className="text-base h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Experience Required
                        </label>
                        <Input
                          value={jobForm.experience}
                          onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                          placeholder="e.g. 2-4 years"
                          className="text-base h-12"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Requirements & Skills */}
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                        <UserIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Requirements & Skills</h3>
                        <p className="text-sm text-gray-600">What candidates need to qualify</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Job Requirements
                        </label>
                        <textarea
                          value={jobForm.requirements}
                          onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                          placeholder="List the key requirements (one per line):&#10;• Bachelor's degree in Computer Science or related field&#10;• 3+ years of experience with React and JavaScript&#10;• Strong problem-solving and communication skills&#10;• Experience with modern development tools and practices"
                          rows={6}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Required Skills (comma-separated)
                        </label>
                        <Input
                          value={jobForm.skills}
                          onChange={(e) => setJobForm({...jobForm, skills: e.target.value})}
                          placeholder="React, JavaScript, TypeScript, Node.js, Git, Agile"
                          className="text-base h-12"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Separate skills with commas. These will appear as tags on your job posting.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Benefits & Perks */}
                  <div className="bg-indigo-50 rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Benefits & Perks</h3>
                        <p className="text-sm text-gray-600">What makes your company attractive</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Benefits
                      </label>
                      <textarea
                        value={jobForm.benefits}
                        onChange={(e) => setJobForm({...jobForm, benefits: e.target.value})}
                        placeholder="List the benefits and perks (one per line):&#10;• Comprehensive health insurance&#10;• Flexible working hours and remote work options&#10;• Professional development budget&#10;• Modern office with free snacks and drinks"
                        rows={5}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                        <p className="text-red-800 font-medium">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {editingJob ? "Updating..." : "Publishing..."}
                        </>
                      ) : (
                        <>
                      <Save className="w-5 h-5 mr-3" />
                      {editingJob ? "Update Job Posting" : "Publish Job Posting"}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      variant="outline"
                      className="flex-1 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5 mr-3" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;