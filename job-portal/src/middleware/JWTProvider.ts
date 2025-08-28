import {Response} from "../domain/Response";
import {StatusCodes} from "http-status-codes";

const AuthDao = require('../dao/AuthDao');
const cosmos = require('../../index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CommonDao = require('../dao/CommonDao');

export const authorize = (req: any, res: any, next: any) => authorizeUser(req, res, next);
export const authorizeUser = async (req: any, res: any, next: any ) => {
    try {
        const commonDao = new CommonDao();
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!commonDao.isNotNullOrUndefinedOrEmpty(token)) {
            let yvpResponse = new Response(StatusCodes.UNAUTHORIZED, "YVP-AUTH", "AUTH", "Invalid token", [{"stack_trace": "No Token provided, please login with valid credentials"}]);
            return res.status(StatusCodes.UNAUTHORIZED).send(yvpResponse);
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err: any) => {
            if (err) {
                let yvpResponse = new Response(StatusCodes.UNAUTHORIZED, "YVP-AUTH", "AUTH", "Invalid token", [{"stack_trace": "Invalid Token, please login with valid credentials"}]);
                return res.status(StatusCodes.UNAUTHORIZED).send(yvpResponse);
            }
            let decodedToken: any;
            decodedToken = decodeJWTToken(token);

            //Check if user is valid
            let authDao = new AuthDao(cosmos.cosmosDao);
            let result = await authDao.getUser(req,decodedToken.userId || decodedToken.email);
            if (result) {
                if (decodedToken.env !== process.env.ENV) {//INC588778
                    // @ts-ignore
                    if (parseInt(process.env.DEBUG) === 1) {
                        console.log("ENV: " + decodedToken.userAgent + " , ENV: " + process.env.ENV);
                    }
                    let yvpResponse = new Response(StatusCodes.UNAUTHORIZED, "YVP-AUTH", "AUTH", "Invalid token", [{"stack_trace": "Invalid Token, please login with valid credentials"}]);
                    return res.status(StatusCodes.UNAUTHORIZED).send(yvpResponse);
                }
                //Refresh Token
                const jwtToken = generateJWT(result.email,(result.role ??'jobSeeker'), req,null,decodedToken.sessionId);//INC588778
                res.header('X-AUTH-TOKEN', jwtToken);
            } else {
                let yvpResponse = new Response(StatusCodes.UNAUTHORIZED, "YVP-AUTH", "AUTH", "Invalid token", [{"stack_trace": "Invalid Token, please login with valid credentials"}]);
                return res.status(StatusCodes.UNAUTHORIZED).send(yvpResponse);
            }
            next();
        });
    } catch (e: any) {
        // @ts-ignore
        if (parseInt(process.env.DEBUG) === 1) {
            console.log(e.stack);
        }
        let yvpResponse = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "AUTH", e.message, [{"stack_trace": e.stack}]);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(yvpResponse);
    }
};

export const decodeJWTToken = (authorization: string) => {
    return jwt.verify(authorization, process.env.JWT_SECRET_KEY);
}

export const generateJWT = (userId: string, role: string, req: any,expiryTime:any,sessionId:any) => {
    const jwtConstruction = {
        userId: userId,
        role: role,
        userAgent: req.headers['user-agent'],
        env: process.env.ENV,
        sessionId : sessionId
    };
    const jwtExpiry = {
        expiresIn: expiryTime ? expiryTime : process.env.JWT_EXPIRY
    };
    // @ts-ignore
    if (parseInt(process.env.DEBUG) === 1) {
        console.log("jwtConstruction");
        console.log(jwtConstruction);
    }

    return jwt.sign(jwtConstruction, process.env.JWT_SECRET_KEY, jwtExpiry);
}

export const validateLogin = (password: any, bcryptPassword: any) => {
    return bcrypt.compareSync(password, bcryptPassword)
}
