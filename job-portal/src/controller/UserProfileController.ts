import {Response} from "../domain/Response";
import {StatusCodes} from 'http-status-codes';
const UserProfileDao = require('../dao/UserProfileDao');

class UserProfileController {

    getUserProfile = async (req: any, res: any) => {
        try {
            const userProfileDao = new UserProfileDao();
            let result = await userProfileDao.getUserProfile(req);
            let response = new Response(StatusCodes.OK, "USER-PROFILE", "GET-PROFILE", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "USER-PROFILE", "GET-PROFILE", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    updateUserProfile = async (req: any, res: any) => {
        try {
            const userProfileDao = new UserProfileDao();
            let result = await userProfileDao.updateUserProfile(req);
            let response = new Response(StatusCodes.OK, "USER-PROFILE", "UPDATE-PROFILE", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "USER-PROFILE", "UPDATE-PROFILE", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getAllUserProfiles = async (req: any, res: any) => {
        try {
            const userProfileDao = new UserProfileDao();
            let result = await userProfileDao.getAllUserProfiles(req);
            let response = new Response(StatusCodes.OK, "USER-PROFILE", "GET-ALL-PROFILES", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "USER-PROFILE", "GET-ALL-PROFILES", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    deleteUserProfile = async (req: any, res: any) => {
        try {
            const userProfileDao = new UserProfileDao();
            let result = await userProfileDao.deleteUserProfile(req);
            let response = new Response(StatusCodes.OK, "USER-PROFILE", "DELETE-PROFILE", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "USER-PROFILE", "DELETE-PROFILE", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    searchUserProfiles = async (req: any, res: any) => {
        try {
            const userProfileDao = new UserProfileDao();
            let result = await userProfileDao.searchUserProfiles(req);
            let response = new Response(StatusCodes.OK, "USER-PROFILE", "SEARCH-PROFILES", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "USER-PROFILE", "SEARCH-PROFILES", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
}

module.exports = new UserProfileController();