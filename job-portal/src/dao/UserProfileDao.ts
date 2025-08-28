export const sql = require('mssql');
const uuid = require('uuid');
const { mongoDb } = require('./core/MongoDb');

class UserProfileDao {
    constructor() {
    }
    
    // Get user profile data
    getUserProfile = async (req: any) => {
        try {
            const { email } = req.body;
            console.log('🔍 Getting user profile for:', email);
            
            const userProfile = await mongoDb.findOne('userProfiles', { email });
            console.log('📋 Found user profile:', userProfile);
            
            return Promise.resolve(userProfile ? [userProfile] : []);
        }
        catch(e: any) {
            console.error('❌ Error getting user profile:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Update user profile data
    updateUserProfile = async (req: any) => {
        try {
            let profileObj = req.body;
            console.log('🔄 Updating user profile:', profileObj);
            
            // Add/update timestamps
            profileObj["modified_dtz"] = new Date();
            if (!profileObj.created_dtz) {
                profileObj["created_dtz"] = new Date();
            }
            
            // Generate ID if not exists
            if (!profileObj._id) {
                profileObj["_id"] = uuid.v4();
            }
            
            // Check if profile exists
            const existingProfile = await mongoDb.findOne('userProfiles', { email: profileObj.email });
            
            let result;
            if (existingProfile) {
                // Update existing profile
                result = await mongoDb.updateOne('userProfiles', { email: profileObj.email }, profileObj);
                console.log('✅ User profile updated:', result);
            } else {
                // Create new profile
                result = await mongoDb.insertOne('userProfiles', profileObj);
                console.log('✅ User profile created:', result);
            }
            
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error updating user profile:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Get all user profiles (for admin purposes)
    getAllUserProfiles = async (req: any) => {
        try {
            console.log('🔍 Getting all user profiles');
            
            const profiles = await mongoDb.findMany('userProfiles', {});
            console.log('📋 Found user profiles:', profiles.length);
            
            return Promise.resolve(profiles);
        }
        catch(e: any) {
            console.error('❌ Error getting all user profiles:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Delete user profile
    deleteUserProfile = async (req: any) => {
        try {
            const { email } = req.body;
            console.log('🗑️ Deleting user profile for:', email);
            
            const result = await mongoDb.deleteOne('userProfiles', { email });
            console.log('✅ User profile deleted:', result);
            
            return Promise.resolve(result);
        }
        catch(e: any) {
            console.error('❌ Error deleting user profile:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    
    // Search user profiles by skills, location, etc.
    searchUserProfiles = async (req: any) => {
        try {
            const { skills, location, experience } = req.body;
            console.log('🔍 Searching user profiles with filters:', { skills, location, experience });
            
            let query: any = {};
            
            // Add skill filter
            if (skills && skills.length > 0) {
                query['skills.name'] = { $in: skills };
            }
            
            // Add location filter
            if (location) {
                query['$or'] = [
                    { 'personalInfo.location': { $regex: location, $options: 'i' } },
                    { 'preferences.locations': { $in: [location] } }
                ];
            }
            
            // Add experience filter
            if (experience) {
                query['experience.position'] = { $regex: experience, $options: 'i' };
            }
            
            const profiles = await mongoDb.findMany('userProfiles', query);
            console.log('📋 Found matching profiles:', profiles.length);
            
            return Promise.resolve(profiles);
        }
        catch(e: any) {
            console.error('❌ Error searching user profiles:', e);
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
}

module.exports = UserProfileDao;