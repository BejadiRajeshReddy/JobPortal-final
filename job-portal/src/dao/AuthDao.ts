import EmailServiceDao from "./EmailServiceDao";

const config = require('../../index');

export {}

const mongoDb = require('./core/MongoDb');

const uuid = require('uuid');
// @ts-ignore
const bcrypt = require('bcrypt');
class AuthDao {
    constructor() {
    }
    signUp = async (req: any) => {
        try {
            let userObj = req.body;

            if (!userObj.name || !userObj.email || !userObj.password){
                return Promise.resolve({message:"Name, email and password required"});
            }
            userObj["created_dtz"] = new Date();
            userObj["_id"] = uuid.v4();
            const existing = await mongoDb.mongoDb.findOne('users', {email:userObj.email});
            if (existing)
                return Promise.resolve({message:"Email already exists"});

            const hashedPassword = await bcrypt.hash(userObj.password, 10);
            userObj.password = hashedPassword;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
            userObj["otp"] = otp;
            userObj["otpExpiry"] = otpExpiry;
            userObj["isVerified"] = false;
            await mongoDb.mongoDb.insertOne('users', userObj);
            const mailer = new EmailServiceDao();
            await mailer.sendOtpEmail(userObj.email, otp);
        return Promise.resolve({ message: 'OTP sent to your email' });
    }

    catch(e: any) {
        // @ts-ignore
        if (parseInt(process.env.DEBUG) === 1) {
            console.log(e.stack);
        }
        return Promise.reject(e);
    }
}
    getUser = async (req: any,userId:any) => {
        try {
            let userObj = req.body;
            const existing = await mongoDb.mongoDb.findOne('users', {email:userId});
            return Promise.resolve(existing);
        }
        catch(e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    updateUserDetails = async (req: any) => {
        try {
            let userObj:any = req.body;
            userObj["modified_dtz"] = new Date();
            const existing = await mongoDb.mongoDb.updateOne('users', {"_id":userObj._id},userObj);
            return Promise.resolve(existing);
        }
        catch(e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
}
module.exports = AuthDao;
