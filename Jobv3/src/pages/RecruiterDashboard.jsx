import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  Building,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import jobService from "../services/jobService";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salary: { min: "", max: "", currency: "INR" },
    experience: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: "",
    deadline: "",
    status: "active",
  });

  useEffect(() => {
    // Check if user is logged in and is a recruiter
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "recruiter") {
      navigate("/profile");
      return;
    }

    setCurrentUser(userData);
    loadJobs(userData.email);
  }, [navigate]);

  useEffect(() => {
    // Filter jobs based on search and status
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  const loadJobs = async (recruiterId) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await jobService.getRecruiterJobs(recruiterId);
      
      if (response && Array.isArray(response)) {
        setJobs(response);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError("Failed to load jobs");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = () => {
    setJobForm({
      title: "",
      company: currentUser?.orgName || "",
      location: "",
      type: "full-time",
      salary: { min: "", max: "", currency: "INR" },
      experience: "",
      description: "",
      requirements: "",
      benefits: "",
      skills: "",
      deadline: "",
      status: "active",
    });
    setEditingJob(null);
    setShowJobForm(true);
    setError("");
    setSuccess("");
  };

  const handleEditJob = (job) => {
    setJobForm({
      ...job,
      salary: job.salary || { min: "", max: "", currency: "INR" },
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || "",
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits || "",
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || "",
    });
    setEditingJob(job);
    setShowJobForm(true);
    setError("");
    setSuccess("");
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId && job._id !== jobId));
      setSuccess("Job deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job");
    }
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      
      // Validate required fields
      if (!jobForm.title || !jobForm.location || !jobForm.description) {
        setError("Please fill in all required fields");
        return;
      }

      const jobData = {
        ...jobForm,
        recruiterId: currentUser.email,
        company: {
          name: currentUser.orgName || jobForm.company,
          email: currentUser.email,
        },
        postedAt: editingJob ? editingJob.postedAt : new Date().toISOString(),
        posted: editingJob ? editingJob.posted : "Just now",
      };

      if (editingJob) {
        // Update existing job
        jobData.id = editingJob.id;
        jobData._id = editingJob._id;
        await jobService.updateJob(jobData);
        
        // Update local state
        setJobs(jobs.map(job => 
          (job.id === editingJob.id || job._id === editingJob._id) ? jobData : job
        ));
        setSuccess("Job updated successfully!");
      } else {
        // Create new job
        const response = await jobService.insertJob(jobData);
        
        // Add to local state
        setJobs([...jobs, { ...jobData, id: response.insertedId || Date.now().toString() }]);
        setSuccess("Job created successfully!");
      }

      setShowJobForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving job:", err);
      setError("Failed to save job");
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setShowApplicants(true);
  };

  const getJobStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === "active").length;
    const totalApplicants = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
    const avgApplicants = totalJobs > 0 ? Math.round(totalApplicants / totalJobs) : 0;

    return { totalJobs, activeJobs, totalApplicants, avgApplicants };
  };

  const stats = getJobStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {currentUser?.name}! Manage your job postings and applications.
            </p>
          </div>
          <Button onClick={handleCreateJob} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgApplicants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 
                  ? "You haven't posted any jobs yet. Create your first job posting!"
                  : "No jobs match your current filters."
                }
              </p>
              {jobs.length === 0 && (
                <Button onClick={handleCreateJob}>Post Your First Job</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id || job._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' :
                          job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {job.posted}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {job.salary.min && job.salary.max 
                              ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}`
                              : "Salary not disclosed"
                            }
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {job.applicants?.length || 0} applicants
                        </div>
                        {job.deadline && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleViewApplicants(job)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Users className="w-4 h-4" />
                        View Applicants
                      </Button>
                      <Button
                        onClick={() => handleEditJob(job)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteJob(job.id || job._id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJob ? "Edit Job" : "Post New Job"}
                </h2>
                <Button
                  onClick={() => setShowJobForm(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmitJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <Input
                      value={jobForm.title}
                      onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                      placeholder="e.g. Senior Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <Input
                      value={jobForm.location}
                      onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                      placeholder="e.g. Bangalore, India"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <Select value={jobForm.type} onValueChange={(value) => setJobForm({...jobForm, type: value})}>
                      <SelectTrigger>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Required
                    </label>
                    <Input
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({...jobForm, experience: e.target.value})}
                      placeholder="e.g. 2-5 years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary (₹)
                    </label>
                    <Input
                      type="number"
                      value={jobForm.salary.min}
                      onChange={(e) => setJobForm({
                        ...jobForm, 
                        salary: {...jobForm.salary, min: parseInt(e.target.value) || ""}
                      })}
                      placeholder="e.g. 500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary (₹)
                    </label>
                    <Input
                      type="number"
                      value={jobForm.salary.max}
                      onChange={(e) => setJobForm({
                        ...jobForm, 
                        salary: {...jobForm.salary, max: parseInt(e.target.value) || ""}
                      })}
                      placeholder="e.g. 800000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                    placeholder="List the requirements (one per line)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills Required
                  </label>
                  <Input
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({...jobForm, skills: e.target.value})}
                    placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  <textarea
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({...jobForm, benefits: e.target.value})}
                    placeholder="List the benefits (one per line)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <Input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({...jobForm, deadline: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingJob ? "Update Job" : "Post Job"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicants && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Applicants for {selectedJob.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedJob.applicants?.length || 0} applications received
                  </p>
                </div>
                <Button
                  onClick={() => setShowApplicants(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {selectedJob.applicants && selectedJob.applicants.length > 0 ? (
                <div className="space-y-4">
                  {selectedJob.applicants.map((applicant, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {applicant.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {applicant.coverLetter && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-900 mb-1">Cover Letter:</h4>
                              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                                {applicant.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">
                    Applications will appear here once candidates start applying to this job.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;