export const sql = require('mssql');
const uuid = require('uuid');
const { mongoDb } = require('./core/MongoDb');
const jobIds = recruiterJobs.map((job: any) => job._id);

pendingApplications: applications.filter((app: any) => app.status === 'pending').length,
acceptedApplications: applications.filter((app: any) => app.status === 'accepted').length,
rejectedApplications: applications.filter((app: any) => app.status === 'rejected').length,
interviewApplications: applications.filter((app: any) => app.status === 'interview').length
acceptedApplications: applications.filter((app: any) => app.status === 'accepted').length,
rejectedApplications: applications.filter((app: any) => app.status === 'rejected').length,
interviewApplications: applications.filter((app: any) => app.status === 'interview').length

class ApplicationDao {
    constructor() {
    }
    
    // Submit job application
    submitApplication = async (req: any) => {
        try {
            let applicationObj = req.body;
            console.log('📝 Submitting application:', applicationObj);
            
            // Add required fields
            applicationObj["_id"] = uuid.v4();
            applicationObj["created_dtz"] = new Date();
            applicationObj["status"] = "pending";
            
            // Insert application
            const result = await mongoDb.insertOne('applications', applicationObj);
            console.log('✅ Application submitted:', result);
            
            // Also update the job with the new applicant
            if (applicationObj.jobId) {
                const job = await mongoDb.findOne('job', { _id: applicationObj.jobId });
                if (job) {
                    const applicants = job.applicants || [];
                    applicants.push({
                        userId: applicationObj.userId,
                        name: applicationObj.candidateName,
                        email: applicationObj.candidateEmail,
                        coverLetter: applicationObj.coverLetter,
                        resume: applicationObj.resume,
                        appliedAt: new Date().toISOString(),
                        status: "pending"
                    });
                    
                    await mongoDb.updateOne('job', { _id: applicationObj.jobId }, { applicants });
                    console.log('✅ Job updated with new applicant');
                }
            }
            
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error submitting application:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Get applications for a candidate
    getCandidateApplications = async (req: any) => {
        try {
            const { userId } = req.body;
            console.log('🔍 Getting applications for candidate:', userId);
            
            const applications = await mongoDb.findMany('applications', { userId });
            console.log('📋 Found applications:', applications.length);
            
            return Promise.resolve(applications);
        }
        catch(e: any) {
            console.error('❌ Error getting candidate applications:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Get applications for a job (recruiter view)
    getJobApplications = async (req: any) => {
        try {
            const { jobId } = req.body;
            console.log('🔍 Getting applications for job:', jobId);
            
            const applications = await mongoDb.findMany('applications', { jobId });
            console.log('📋 Found applications:', applications.length);
            
            return Promise.resolve(applications);
        }
        catch(e: any) {
            console.error('❌ Error getting job applications:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Update application status
    updateApplicationStatus = async (req: any) => {
        try {
            const { applicationId, status, notes } = req.body;
            console.log('🔄 Updating application status:', { applicationId, status });
            
            const updateData = {
                status,
                modified_dtz: new Date(),
                ...(notes && { notes })
            };
            
            const result = await mongoDb.updateOne('applications', { _id: applicationId }, updateData);
            console.log('✅ Application status updated:', result);
            
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error updating application status:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Get all applications for a recruiter
    getRecruiterApplications = async (req: any) => {
        try {
            const { recruiterId } = req.body;
            console.log('🔍 Getting applications for recruiter:', recruiterId);
            
            // First get all jobs by this recruiter
            const recruiterJobs = await mongoDb.findMany('job', { recruiterId });
            const jobIds = recruiterJobs.map(job => job._id);
            
            // Then get all applications for these jobs
            const applications = await mongoDb.findMany('applications', { 
                jobId: { $in: jobIds } 
            });
            
            console.log('📋 Found applications for recruiter:', applications.length);
            
            return Promise.resolve(applications);
        }
        catch(e: any) {
            console.error('❌ Error getting recruiter applications:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Delete application
    deleteApplication = async (req: any) => {
        try {
            const { applicationId } = req.body;
            console.log('🗑️ Deleting application:', applicationId);
            
            const result = await mongoDb.deleteOne('applications', { _id: applicationId });
            console.log('✅ Application deleted:', result);
            
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error deleting application:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Get application statistics
    getApplicationStats = async (req: any) => {
        try {
            const { recruiterId, userId } = req.body;
            console.log('📊 Getting application stats for:', { recruiterId, userId });
            
            let stats = {};
            
            if (recruiterId) {
                // Get stats for recruiter
                const recruiterJobs = await mongoDb.findMany('job', { recruiterId });
                const jobIds = recruiterJobs.map(job => job._id);
                const applications = await mongoDb.findMany('applications', { 
                    jobId: { $in: jobIds } 
                });
                
                stats = {
                    totalApplications: applications.length,
                    pendingApplications: applications.filter(app => app.status === 'pending').length,
                    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
                    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
                    totalJobs: recruiterJobs.length,
                    avgApplicationsPerJob: recruiterJobs.length > 0 ? Math.round(applications.length / recruiterJobs.length) : 0
                };
            } else if (userId) {
                // Get stats for candidate
                const applications = await mongoDb.findMany('applications', { userId });
                
                stats = {
                    totalApplications: applications.length,
                    pendingApplications: applications.filter(app => app.status === 'pending').length,
                    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
                    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
                    interviewApplications: applications.filter(app => app.status === 'interview').length
                };
            }
            
            console.log('📊 Application stats:', stats);
            return Promise.resolve(stats);
        }
        catch(e: any) {
            console.error('❌ Error getting application stats:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
}

module.exports = ApplicationDao;