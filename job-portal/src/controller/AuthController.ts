import {Response} from "../domain/Response";
import {StatusCodes,} from 'http-status-codes';
import {decodeJWTToken, generateJWT, validateLogin} from "../middleware/JWTProvider";

const cosmos = require('../../index');
const AuthDao = require('../dao/AuthDao');

const authDao = new AuthDao(cosmos.cosmosDao);
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const config = require('../../index');
const EmailServiceDao = require('../dao/EmailServiceDao');

class AuthController {
    login = async  (req: any, res: any)=> {
       // let emailServiceDao = new EmailServiceDao();
        let message = "Success";
        try {
            let authDao = new AuthDao();
            let result:any = await authDao.getUser(req,req.body.user_id);
            if (result) {
                let isValidLogin = validateLogin(req.body.password, result.password)
                if(isValidLogin) {
                    let sessionId = uuid.v4();
                    const jwtToken = generateJWT(result.email, (result.role ??'jobSeeker'), req, null, sessionId);
                    req.headers['authorization'] = jwtToken;
                    res.header('X-AUTH-TOKEN', jwtToken);
                }
                if(!isValidLogin){
                    message = "User and Password is invalid"
                }
            }else {
                message = "User and Password is invalid"
            }
            let response = new Response(StatusCodes.OK, 'AUTH', 'LOGIN', message, [result]);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            const body = `<html>
                                    <head>
                                        <title></title>
                                    </head>
                                    <body>
                                        <p>User Id : ${req.body.user_id}</p>                              
                                        <div>Error : ${e.stack + e.message}</div>
                                    </body>                           
                                </html>`
            //await emailServiceDao.buildEmailObject('Auth Login Failure', body, process.env.EXCEPTION_EMAIL_ADDRESS, req,"UI")
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, 'YVP-AUTH', 'LOGIN', e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    changePassword = async function (req: any, res: any) {
        try {
            let result = await authDao.changePassword(req);
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "CHANGE-PASSWORD", "Success", [result]);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "CHANGE-PASSWORD", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    sendOTP = async function (req: any, res: any) {
        try {
            let result = await authDao.sendOTP(req);
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "sendOTP", "Success", [result]);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "sendOTP", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    refreshToken = async function (req: any, res: any) {
        try {
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "refreshToken", "Success", ["Token Refreshed Successfully"]);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "refreshToken", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    logout = async function (req: any, res: any) {
        try {
            let sessionId = uuid.v4();//INC588778
            if(req.body.userId){
                let user : any= {
                    user_id :req.body.userId
                }
                await authDao.addUserInfoToRedis(user,req,sessionId);
            }
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "LOGOUT", "Success", ["Logged Out Successfully"]);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "LOGOUT", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    signUp = async function (req: any, res: any) {
        try {
            let result = await authDao.signUp(req);
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "SIGN-UP", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "CHANGE-PASSWORD", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    testApi = async function (req: any, res: any) {
        try {
            let response = new Response(StatusCodes.OK, "YVP-AUTH", "TEST-API", "API is working!", []);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "YVP-AUTH", "TEST-API", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    updateUserDetails = async  (req: any, res: any)=> {
        try {
            let authDao = new AuthDao();
            let result = await authDao.updateUserDetails(req);
            let response = new Response(StatusCodes.OK,  "AUTH", "UPDATE-USER-DETAIL", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "AUTH", "UPDATE-USER-DETAIL", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    getUserDetails = async  (req: any, res: any)=> {
        try {
            let authDao = new AuthDao();
            let result = await authDao.getUserDetails(req);
            let response = new Response(StatusCodes.OK, "AUTH", "GET-USER-DETAIL", "Success", result);
            res.status(StatusCodes.OK).send(response);
        }catch(e:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        }
    }
}


module.exports = new AuthController();
