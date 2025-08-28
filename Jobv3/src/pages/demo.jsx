import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Upload,
  Download,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
  Calendar,
  Building,
  GraduationCap,
  Code,
  FolderOpen,
  Camera,
  Star,
  Award,
  Briefcase,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingSection, setEditingSection] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
  });

  const [aboutMe, setAboutMe] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  });

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // Form states for adding/editing items
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Beginner",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    startDate: "",
    endDate: "",
    current: false,
    githubUrl: "",
    liveUrl: "",
    highlights: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== "candidate") {
        navigate("/dashboard");
        return;
      }
      setCurrentUser(userData);
      loadUserProfile(userData.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const loadUserProfile = (userId) => {
    const profiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
    const profile = profiles[userId] || {};

    setPersonalInfo({
      fullName: profile.fullName || currentUser?.name || "",
      email: profile.email || currentUser?.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      jobTitle: profile.jobTitle || "",
    });

    setAboutMe(profile.aboutMe || "");
    setSocialLinks(
      profile.socialLinks || {
        linkedin: "",
        github: "",
        portfolio: "",
        website: "",
      }
    );

    setExperience(profile.experience || []);
    setEducation(profile.education || []);
    setSkills(profile.skills || []);
    setProjects(profile.projects || []);
    setUploadedResume(profile.resume || null);
    setProfilePicture(profile.profilePicture || null);
  };

  const saveProfile = () => {
    if (!currentUser) return;

    const profiles = JSON.parse(localStorage.getItem("userProfiles") || "{}");
    profiles[currentUser.id] = {
      ...personalInfo,
      aboutMe,
      socialLinks,
      experience,
      education,
      skills,
      projects,
      resume: uploadedResume,
      profilePicture,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("userProfiles", JSON.stringify(profiles));
  };

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = (section) => {
    setEditingSection(null);
    saveProfile();
  };

  const handleCancel = () => {
    setEditingSection(null);
    if (currentUser) {
      loadUserProfile(currentUser.id);
    }
  };

  // Profile Picture handlers
  const handleProfilePictureUpload = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a valid image file (JPG, PNG, WebP)");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setUploadError("Image size must be less than 2MB");
      return;
    }

    const pictureData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };

    setProfilePicture(pictureData);
    saveProfile();
    setUploadSuccess("Profile picture updated successfully!");
    setTimeout(() => setUploadSuccess(""), 3000);
  };

  // Resume upload handlers
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleFileUpload = (file) => {
    setUploadError("");
    setUploadSuccess("");

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please upload a PDF or Word document (.pdf, .doc, .docx)"
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    const resumeData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file),
    };

    setUploadedResume(resumeData);
    setUploadSuccess("Resume uploaded successfully!");
    saveProfile();

    setTimeout(() => setUploadSuccess(""), 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Experience handlers
  const addExperience = () => {
    if (!newExperience.title || !newExperience.company) {
      setUploadError("Please fill in required fields (Title and Company)");
      return;
    }

    const experienceItem = {
      ...newExperience,
      id: Date.now().toString(),
    };

    setExperience([...experience, experienceItem]);
    setNewExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setEditingSection(null);
    saveProfile();
  };

  const removeExperience = (id) => {
    setExperience(experience.filter((exp) => exp.id !== id));
    saveProfile();
  };

  // Education handlers
  const addEducation = () => {
    if (!newEducation.degree || !newEducation.institution) {
      setUploadError("Please fill in required fields (Degree and Institution)");
      return;
    }

    const educationItem = {
      ...newEducation,
      id: Date.now().toString(),
    };

    setEducation([...education, educationItem]);
    setNewEducation({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    });
    setEditingSection(null);
    saveProfile();
  };

  const removeEducation = (id) => {
    setEducation(education.filter((edu) => edu.id !== id));
    saveProfile();
  };

  // Skills handlers
  const addSkill = () => {
    if (!newSkill.name) {
      setUploadError("Please enter a skill name");
      return;
    }

    const skillItem = {
      ...newSkill,
      id: Date.now().toString(),
    };

    setSkills([...skills, skillItem]);
    setNewSkill({
      name: "",
      level: "Beginner",
      category: "Technical",
    });
    setEditingSection(null);
    saveProfile();
  };

  const removeSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
    saveProfile();
  };

  // Projects handlers
  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      setUploadError("Please fill in required fields (Title and Description)");
      return;
    }

    const projectItem = {
      ...newProject,
      id: Date.now().toString(),
      technologies: newProject.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      highlights: newProject.highlights
        .split("\n")
        .filter((highlight) => highlight.trim()),
    };

    setProjects([...projects, projectItem]);
    setNewProject({
      title: "",
      description: "",
      technologies: "",
      startDate: "",
      endDate: "",
      current: false,
      githubUrl: "",
      liveUrl: "",
      highlights: "",
    });
    setEditingSection(null);
    saveProfile();
  };

  const removeProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
    saveProfile();
  };

  // Utility functions
  const handleViewResume = () => {
    if (uploadedResume?.url) {
      window.open(uploadedResume.url, "_blank");
    }
  };

  const handleDownloadResume = () => {
    if (uploadedResume?.url) {
      const link = document.createElement("a");
      link.href = uploadedResume.url;
      link.download = uploadedResume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteResume = () => {
    if (window.confirm("Are you sure you want to delete your resume?")) {
      if (uploadedResume?.url) {
        URL.revokeObjectURL(uploadedResume.url);
      }
      setUploadedResume(null);
      saveProfile();
    }
  };

  const triggerFileInput = () => {
    document.getElementById("resume-upload").click();
  };

  const triggerProfilePictureInput = () => {
    document.getElementById("profile-picture-upload").click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Expert":
        return "bg-green-100 text-green-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profilePicture?.url ? (
                    <img
                      src={profilePicture.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {getInitials(personalInfo.fullName || currentUser.name)}
                    </span>
                  )}
                </div>
                <button
                  onClick={triggerProfilePictureInput}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full border-4 border-white flex items-center justify-center transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {personalInfo.fullName || currentUser.name}
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  {personalInfo.jobTitle || "Job Seeker"}
                </p>
                <div className="flex flex-wrap gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">
                      {personalInfo.email || currentUser.email}
                    </span>
                  </div>
                  {personalInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden profile picture input */}
        <input
          id="profile-picture-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
          className="hidden"
        />
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            <Button
              onClick={() => setActiveTab("overview")}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("experience")}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                activeTab === "experience"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Experience
            </Button>
            <Button
              onClick={() => setActiveTab("education")}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                activeTab === "education"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Education
            </Button>
            <Button
              onClick={() => setActiveTab("skills")}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                activeTab === "skills"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Code className="w-5 h-5 mr-3" />
              Skills
            </Button>
            <Button
              onClick={() => setActiveTab("projects")}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                activeTab === "projects"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <FolderOpen className="w-5 h-5 mr-3" />
              Projects
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* First Row: Personal Info, Social Links, About Me */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  {editingSection !== "personal" && (
                    <Button
                      onClick={() => handleEdit("personal")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "personal" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        value={personalInfo.fullName}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <Input
                        value={personalInfo.jobTitle}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            jobTitle: e.target.value,
                          })
                        }
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={personalInfo.location}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            location: e.target.value,
                          })
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleSave("personal")}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-900">
                        {personalInfo.fullName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Job Title
                      </p>
                      <p className="text-gray-900">
                        {personalInfo.jobTitle || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {personalInfo.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-gray-900">
                        {personalInfo.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="text-gray-900">
                        {personalInfo.location || "Not provided"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Social Links
                    </h3>
                  </div>
                  {editingSection !== "social" && (
                    <Button
                      onClick={() => handleEdit("social")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "social" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            linkedin: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <Input
                        value={socialLinks.github}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            github: e.target.value,
                          })
                        }
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio
                      </label>
                      <Input
                        value={socialLinks.portfolio}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            portfolio: e.target.value,
                          })
                        }
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <Input
                        value={socialLinks.website}
                        onChange={(e) =>
                          setSocialLinks({
                            ...socialLinks,
                            website: e.target.value,
                          })
                        }
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleSave("social")}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          LinkedIn
                        </span>
                      </div>
                      {socialLinks.linkedin ? (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Profile
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-gray-800" />
                        <span className="text-sm font-medium text-gray-700">
                          GitHub
                        </span>
                      </div>
                      {socialLinks.github ? (
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Profile
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Portfolio
                        </span>
                      </div>
                      {socialLinks.portfolio ? (
                        <a
                          href={socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Website
                        </span>
                      </div>
                      {socialLinks.website ? (
                        <a
                          href={socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* About Me */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      About Me
                    </h3>
                  </div>
                  {editingSection !== "about" && (
                    <Button
                      onClick={() => handleEdit("about")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "about" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Summary
                      </label>
                      <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        placeholder="Write a compelling summary to showcase your expertise..."
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleSave("about")}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {aboutMe ? (
                      <p className="text-gray-700 leading-relaxed">{aboutMe}</p>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">
                          No professional summary added yet
                        </p>
                        <p className="text-sm text-gray-400">
                          Add a compelling summary to showcase your expertise
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Second Row: Resume (Full Width) */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Resume</h3>
                </div>
              </div>

              {uploadedResume ? (
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {uploadedResume.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFileSize(uploadedResume.size)}</span>
                          <span>•</span>
                          <span>
                            Uploaded{" "}
                            {new Date(
                              uploadedResume.uploadDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleViewResume}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={handleDownloadResume}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={triggerFileInput}
                        variant="outline"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Replace
                      </Button>
                      <Button
                        onClick={handleDeleteResume}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload your resume
                  </h4>
                  <p className="text-gray-600 mb-6">PDF, DOC, DOCX up to 5MB</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={triggerFileInput}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-sm text-gray-500 self-center">
                      or drag and drop your file here
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Error Message */}
              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-700">{uploadError}</span>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700">{uploadSuccess}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Work Experience
                  </h3>
                  <p className="text-gray-600">
                    Add your professional experience
                  </p>
                </div>
              </div>
              {editingSection !== "add-experience" && (
                <Button
                  onClick={() => handleEdit("add-experience")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Experience
                </Button>
              )}
            </div>

            {/* Add Experience Form */}
            {editingSection === "add-experience" && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Experience
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <Input
                      value={newExperience.title}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <Input
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          company: e.target.value,
                        })
                      }
                      placeholder="e.g. Google Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      value={newExperience.location}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={newExperience.startDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={newExperience.endDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newExperience.current}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="current-job"
                      checked={newExperience.current}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          current: e.target.checked,
                          endDate: e.target.checked
                            ? ""
                            : newExperience.endDate,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="current-job"
                      className="ml-2 text-sm text-gray-700"
                    >
                      I currently work here
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={addExperience} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSection(null);
                      setNewExperience({
                        title: "",
                        company: "",
                        location: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        description: "",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Experience List */}
            <div className="space-y-6">
              {experience.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    No experience added yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Add your work experience to showcase your professional
                    journey
                  </p>
                  <Button
                    onClick={() => handleEdit("add-experience")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              ) : (
                experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {exp.title}
                        </h4>
                        <p className="text-blue-600 font-medium">
                          {exp.company}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {exp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current ? "Present" : formatDate(exp.endDate)}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeExperience(exp.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Education
                  </h3>
                  <p className="text-gray-600">
                    Add your educational background
                  </p>
                </div>
              </div>
              {editingSection !== "add-education" && (
                <Button
                  onClick={() => handleEdit("add-education")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Education
                </Button>
              )}
            </div>

            {/* Add Education Form */}
            {editingSection === "add-education" && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Education
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree *
                    </label>
                    <Input
                      value={newEducation.degree}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          degree: e.target.value,
                        })
                      }
                      placeholder="e.g. Bachelor of Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution *
                    </label>
                    <Input
                      value={newEducation.institution}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          institution: e.target.value,
                        })
                      }
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      value={newEducation.location}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g. Stanford, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA (Optional)
                    </label>
                    <Input
                      value={newEducation.gpa}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          gpa: e.target.value,
                        })
                      }
                      placeholder="e.g. 3.8/4.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={newEducation.startDate}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={newEducation.endDate}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newEducation.current}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="current-education"
                      checked={newEducation.current}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : newEducation.endDate,
                        })
                      }
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="current-education"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Currently studying here
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        description: e.target.value,
                      })
                    }
                    placeholder="Relevant coursework, achievements, activities..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={addEducation}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSection(null);
                      setNewEducation({
                        degree: "",
                        institution: "",
                        location: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        gpa: "",
                        description: "",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Education List */}
            <div className="space-y-6">
              {education.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    No education added yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Add your educational background and qualifications
                  </p>
                  <Button
                    onClick={() => handleEdit("add-education")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Education
                  </Button>
                </div>
              ) : (
                education.map((edu) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.degree}
                        </h4>
                        <p className="text-green-600 font-medium">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          {edu.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {edu.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(edu.startDate)} -{" "}
                            {edu.current ? "Present" : formatDate(edu.endDate)}
                          </div>
                          {edu.gpa && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              GPA: {edu.gpa}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeEducation(edu.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Skills & Expertise
                  </h3>
                  <p className="text-gray-600">
                    Showcase your technical and soft skills
                  </p>
                </div>
              </div>
              {editingSection !== "add-skill" && (
                <Button
                  onClick={() => handleEdit("add-skill")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Skill
                </Button>
              )}
            </div>

            {/* Add Skill Form */}
            {editingSection === "add-skill" && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Skill
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Name *
                    </label>
                    <Input
                      value={newSkill.name}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, name: e.target.value })
                      }
                      placeholder="e.g. React, Python, Project Management"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proficiency Level
                    </label>
                    <select
                      value={newSkill.level}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, level: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={addSkill}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSection(null);
                      setNewSkill({
                        name: "",
                        level: "Beginner",
                        category: "Technical",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Skills List */}
            <div className="space-y-6">
              {skills.length === 0 ? (
                <div className="text-center py-12">
                  <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    No skills added yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Add your technical and soft skills to showcase your
                    expertise
                  </p>
                  <Button
                    onClick={() => handleEdit("add-skill")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Skill
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {skill.category}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeSkill(skill.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(
                          skill.level
                        )}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Projects</h3>
                  <p className="text-gray-600">
                    Showcase your work and achievements
                  </p>
                </div>
              </div>
              {editingSection !== "add-project" && (
                <Button
                  onClick={() => handleEdit("add-project")}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Project
                </Button>
              )}
            </div>

            {/* Add Project Form */}
            {editingSection === "add-project" && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Project
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title *
                    </label>
                    <Input
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="e.g. E-commerce Web Application"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="month"
                      value={newProject.startDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={newProject.endDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newProject.current}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      id="current-project"
                      checked={newProject.current}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          current: e.target.checked,
                          endDate: e.target.checked ? "" : newProject.endDate,
                        })
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="current-project"
                      className="ml-2 text-sm text-gray-700"
                    >
                      This is an ongoing project
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <Input
                      value={newProject.githubUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Demo URL
                    </label>
                    <Input
                      value={newProject.liveUrl}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://yourproject.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies Used
                    </label>
                    <Input
                      value={newProject.technologies}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          technologies: e.target.value,
                        })
                      }
                      placeholder="React, Node.js, MongoDB, Express (comma-separated)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what the project does, your role, and the impact..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Highlights (Optional)
                  </label>
                  <textarea
                    value={newProject.highlights}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        highlights: e.target.value,
                      })
                    }
                    placeholder="• Increased user engagement by 40%&#10;• Reduced load time by 60%&#10;• Implemented real-time features"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={addProject}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSection(null);
                      setNewProject({
                        title: "",
                        description: "",
                        technologies: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        githubUrl: "",
                        liveUrl: "",
                        highlights: "",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Projects List */}
            <div className="space-y-6">
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    No projects added yet
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Showcase your work and demonstrate your skills through
                    projects
                  </p>
                  <Button
                    onClick={() => handleEdit("add-project")}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Project
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(project.startDate)} -{" "}
                            {project.current
                              ? "Present"
                              : formatDate(project.endDate)}
                          </div>
                        </div>
                        <div className="flex gap-3 mt-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <Github className="w-4 h-4" />
                              GitHub
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => removeProject(project.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Technologies:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {project.highlights && project.highlights.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Key Highlights:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {project.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {uploadError && (
          <div className="fixed bottom-4 right-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 shadow-lg z-50">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700">{uploadError}</span>
            <Button
              onClick={() => setUploadError("")}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {uploadSuccess && (
          <div className="fixed bottom-4 right-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 shadow-lg z-50">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-green-700">{uploadSuccess}</span>
            <Button
              onClick={() => setUploadSuccess("")}
              variant="ghost"
              size="sm"
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
