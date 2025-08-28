export const sql = require('mssql');
const uuid = require('uuid');
const {BlobServiceClient} = require('@azure/storage-blob');
const CommonDao = require('../dao/CommonDao');
const cosmos = require('../../index');
const AuthDao = require('../dao/AuthDao');
const { mongoDb } = require('./core/MongoDb');

class JobPortalOperationDao {
    constructor() {
    }
    
    getJoblist = async (req: any) => {
        try {
            let userObj = req.body;
            console.log('🔍 Getting jobs for user:', userObj);
            
            // Handle special case for debugging - get all jobs
            if (userObj.user_id === 'all') {
                console.log('🔍 Getting ALL jobs for debugging');
                const allJobs = await mongoDb.findMany('job', {});
                console.log('📋 Found all jobs:', allJobs);
                return Promise.resolve(allJobs);
            }
            
            const existing = await mongoDb.findMany('job', {recruiterId: userObj.user_id});
            console.log('📋 Found jobs for user:', existing);
            return Promise.resolve(existing);
        }
        catch(e: any) {
            console.error('❌ Error getting job list:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }

    getAllJobs = async () => {
        try {
            console.log('🔍 Getting all jobs for public display');
            const allJobs = await mongoDb.findMany('job', {status: 'active'}); // Only show active jobs
            console.log('📋 Found active jobs:', allJobs.length);
            return Promise.resolve(allJobs);
        }
        catch(e: any) {
            console.error('❌ Error getting all jobs:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    insertJob = async (req: any) => {
        try {
            let jobObj = req.body;
            
            // Add required fields
            jobObj["_id"] = jobObj.id || uuid.v4(); // Use provided id or generate new one
            jobObj["id"] = jobObj["_id"]; // Keep both for compatibility
            jobObj["created_dtz"] = new Date();
            jobObj["modified_dtz"] = new Date();
            jobObj["applicants"] = jobObj.applicants || [];
            jobObj["status"] = jobObj.status || "active";
            
            // Ensure skills, requirements, and benefits are arrays
            if (typeof jobObj.skills === 'string') {
                jobObj.skills = jobObj.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean);
            }
            if (typeof jobObj.requirements === 'string') {
                jobObj.requirements = jobObj.requirements.split('\n').filter((req: string) => req.trim());
            }
            if (typeof jobObj.benefits === 'string') {
                jobObj.benefits = jobObj.benefits.split('\n').filter((benefit: string) => benefit.trim());
            }
            
            console.log('📝 Inserting job with data:', jobObj);
            const result = await mongoDb.insertOne('job', jobObj);
            console.log('✅ Job inserted successfully:', result);
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error inserting job:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    updateJob = async (req: any) => {
        try {
            let jobObj = req.body;
            
            // Update modified timestamp
            jobObj["modified_dtz"] = new Date();
            
            // Ensure skills, requirements, and benefits are arrays
            if (typeof jobObj.skills === 'string') {
                jobObj.skills = jobObj.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean);
            }
            if (typeof jobObj.requirements === 'string') {
                jobObj.requirements = jobObj.requirements.split('\n').filter((req: string) => req.trim());
            }
            if (typeof jobObj.benefits === 'string') {
                jobObj.benefits = jobObj.benefits.split('\n').filter((benefit: string) => benefit.trim());
            }
            
            // Use either _id or id for the query
            const queryId = jobObj._id || jobObj.id;
            console.log('🔄 Updating job with ID:', queryId);
            const result = await mongoDb.updateOne('job', {_id: queryId}, jobObj);
            console.log('✅ Job updated successfully:', result);
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error updating job:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }

    deleteJob = async (req: any) => {
        try {
            let jobObj = req.body;
            const jobId = jobObj.jobId;
            
            console.log('🗑️ Deleting job with ID:', jobId);
            const result = await mongoDb.deleteOne('job', {_id: jobId});
            console.log('✅ Job deleted successfully:', result);
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error deleting job:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
}

module.exports = JobPortalOperationDao;
