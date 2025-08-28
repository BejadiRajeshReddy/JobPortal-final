import {Response} from "../domain/Response";
import {StatusCodes} from 'http-status-codes';
const ApplicationDao = require('../dao/ApplicationDao');

class ApplicationController {

    submitApplication = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.submitApplication(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "SUBMIT-APPLICATION", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "SUBMIT-APPLICATION", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getCandidateApplications = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.getCandidateApplications(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "GET-CANDIDATE-APPLICATIONS", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "GET-CANDIDATE-APPLICATIONS", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getJobApplications = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.getJobApplications(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "GET-JOB-APPLICATIONS", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "GET-JOB-APPLICATIONS", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    updateApplicationStatus = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.updateApplicationStatus(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "UPDATE-APPLICATION-STATUS", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "UPDATE-APPLICATION-STATUS", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getRecruiterApplications = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.getRecruiterApplications(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "GET-RECRUITER-APPLICATIONS", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "GET-RECRUITER-APPLICATIONS", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    deleteApplication = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.deleteApplication(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "DELETE-APPLICATION", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "DELETE-APPLICATION", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getApplicationStats = async (req: any, res: any) => {
        try {
            const applicationDao = new ApplicationDao();
            let result = await applicationDao.getApplicationStats(req);
            let response = new Response(StatusCodes.OK, "APPLICATION", "GET-APPLICATION-STATS", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "APPLICATION", "GET-APPLICATION-STATS", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
}

module.exports = new ApplicationController();