import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  Building,
  FileText,
  Star,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import jobService from "../services/jobService";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile data state
  const [profileData, setProfileData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      profilePicture: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    preferences: {
      jobTypes: [],
      locations: [],
      salaryRange: { min: "", max: "" },
      remoteWork: false,
    },
  });

  // Form state for editing
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Check if user is logged in and is a candidate
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== "candidate") {
      navigate("/dashboard");
      return;
    }

    setCurrentUser(userData);
    loadUserProfile(userData.email);
  }, [navigate]);

  const loadUserProfile = async (email) => {
    try {
      setIsLoading(true);
      setError("");

      // Try to get profile from MongoDB
      const response = await jobService.getUsersData({ email });
      
      if (response && response.result && response.result.length > 0) {
        const userProfile = response.result[0];
        setProfileData({
          personalInfo: {
            name: userProfile.name || "",
            email: userProfile.email || "",
            phone: userProfile.phoneNumber || userProfile.phone || "",
            location: userProfile.location || "",
            bio: userProfile.bio || "",
            profilePicture: userProfile.profilePicture || "",
          },
          experience: userProfile.experience || [],
          education: userProfile.education || [],
          skills: userProfile.skills || [],
          certifications: userProfile.certifications || [],
          preferences: userProfile.preferences || {
            jobTypes: [],
            locations: [],
            salaryRange: { min: "", max: "" },
            remoteWork: false,
          },
        });
      } else {
        // Initialize with basic user data if no profile exists
        setProfileData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            phone: currentUser?.phoneNumber || "",
          }
        }));
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setEditData(JSON.parse(JSON.stringify(profileData)));
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      // Validate required fields
      if (!editData.personalInfo?.name || !editData.personalInfo?.email) {
        setError("Name and email are required");
        return;
      }

      // Prepare data for backend
      const updateData = {
        email: currentUser.email,
        name: editData.personalInfo.name,
        phoneNumber: editData.personalInfo.phone,
        location: editData.personalInfo.location,
        bio: editData.personalInfo.bio,
        profilePicture: editData.personalInfo.profilePicture,
        experience: editData.experience || [],
        education: editData.education || [],
        skills: editData.skills || [],
        certifications: editData.certifications || [],
        preferences: editData.preferences || {
          jobTypes: [],
          locations: [],
          salaryRange: { min: "", max: "" },
          remoteWork: false,
        },
      };

      // Update profile in MongoDB
      await jobService.updateUserData(updateData);

      // Update local state
      setProfileData(editData);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setEditData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }));
  };

  const removeExperience = (id) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
    };
    setEditData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const removeEducation = (id) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = () => {
    const skillName = prompt("Enter skill name:");
    if (skillName && skillName.trim()) {
      const newSkill = {
        id: Date.now().toString(),
        name: skillName.trim(),
        level: "Intermediate",
      };
      setEditData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill]
      }));
    }
  };

  const removeSkill = (id) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const updateSkill = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading profile...</h2>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editData : profileData;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your professional information</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  {currentData.personalInfo?.profilePicture ? (
                    <img
                      src={currentData.personalInfo.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    value={editData.personalInfo?.name || ""}
                    onChange={(e) =>
                      setEditData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          name: e.target.value
                        }
                      }))
                    }
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900">{currentData.personalInfo?.name || "Not provided"}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{currentData.personalInfo?.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <Input
                    value={editData.personalInfo?.phone || ""}
                    onChange={(e) =>
                      setEditData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          phone: e.target.value
                        }
                      }))
                    }
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{currentData.personalInfo?.phone || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={editData.personalInfo?.location || ""}
                    onChange={(e) =>
                      setEditData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          location: e.target.value
                        }
                      }))
                    }
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{currentData.personalInfo?.location || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.personalInfo?.bio || ""}
                    onChange={(e) =>
                      setEditData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          bio: e.target.value
                        }
                      }))
                    }
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  />
                ) : (
                  <p className="text-gray-900">{currentData.personalInfo?.bio || "No bio provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Professional Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
                {isEditing && (
                  <Button onClick={addExperience} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentData.experience && currentData.experience.length > 0 ? (
                <div className="space-y-4">
                  {currentData.experience.map((exp, index) => (
                    <div key={exp.id || index} className="border rounded-lg p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              <Input
                                placeholder="Company"
                                value={exp.company || ""}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              />
                              <Input
                                placeholder="Position"
                                value={exp.position || ""}
                                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={() => removeExperience(exp.id)}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="date"
                              placeholder="Start Date"
                              value={exp.startDate || ""}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            />
                            <Input
                              type="date"
                              placeholder="End Date"
                              value={exp.endDate || ""}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              disabled={exp.current}
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={exp.current || false}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            />
                            <span className="text-sm">Currently working here</span>
                          </label>
                          <textarea
                            placeholder="Job description..."
                            value={exp.description || ""}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                              <p className="text-blue-600 flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {exp.company}
                              </p>
                              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                <Calendar className="w-4 h-4" />
                                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                              </p>
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No work experience added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
                {isEditing && (
                  <Button onClick={addEducation} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Education
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentData.education && currentData.education.length > 0 ? (
                <div className="space-y-4">
                  {currentData.education.map((edu, index) => (
                    <div key={edu.id || index} className="border rounded-lg p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                              <Input
                                placeholder="Institution"
                                value={edu.institution || ""}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              />
                              <Input
                                placeholder="Degree"
                                value={edu.degree || ""}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={() => removeEducation(edu.id)}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            placeholder="Field of Study"
                            value={edu.field || ""}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <Input
                              type="date"
                              placeholder="Start Date"
                              value={edu.startDate || ""}
                              onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            />
                            <Input
                              type="date"
                              placeholder="End Date"
                              value={edu.endDate || ""}
                              onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                              disabled={edu.current}
                            />
                            <Input
                              placeholder="GPA (optional)"
                              value={edu.gpa || ""}
                              onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={edu.current || false}
                              onChange={(e) => updateEducation(edu.id, "current", e.target.checked)}
                            />
                            <span className="text-sm">Currently studying here</span>
                          </label>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-blue-600">{edu.institution}</p>
                          <p className="text-gray-600">{edu.field}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No education added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills
                </CardTitle>
                {isEditing && (
                  <Button onClick={addSkill} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentData.skills && currentData.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentData.skills.map((skill, index) => (
                    <div key={skill.id || index} className="border rounded-lg p-3">
                      {isEditing ? (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Input
                              value={skill.name || ""}
                              onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              placeholder="Skill name"
                              className="mb-2"
                            />
                            <select
                              value={skill.level || "Intermediate"}
                              onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                          <Button
                            onClick={() => removeSkill(skill.id)}
                            variant="outline"
                            size="sm"
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= (skill.level === "Expert" ? 5 : skill.level === "Advanced" ? 4 : skill.level === "Intermediate" ? 3 : 2)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{skill.level}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No skills added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;