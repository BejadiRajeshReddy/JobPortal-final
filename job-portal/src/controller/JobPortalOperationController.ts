import {Response} from "../domain/Response";
import {StatusCodes} from 'http-status-codes';
const JobPortalOperationDao = require('../dao/JobPortalOperationDao');
const cosmos = require('../../index');

class JobPortalOperationController {

    getJoblist = async  (req: any, res: any)=> {
        try {
            const jobPortalOperationDao = new JobPortalOperationDao();
            let result = await jobPortalOperationDao.getJoblist(req);
            let response = new Response(StatusCodes.OK, "JOB-PORTAL", "JOB-FETCH-LIST", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "JOB-PORTAL", "JOB-FETCH-LIST", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    getAllJobs = async (req: any, res: any) => {
        try {
            const jobPortalOperationDao = new JobPortalOperationDao();
            let result = await jobPortalOperationDao.getAllJobs();
            let response = new Response(StatusCodes.OK, "JOB-PORTAL", "JOB-FETCH-ALL", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "JOB-PORTAL", "JOB-FETCH-ALL", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    
    insertJob = async  (req: any, res: any)=> {
        try {
            const jobPortalOperationDao = new JobPortalOperationDao();
            let result = await jobPortalOperationDao.insertJob(req);
            let response = new Response(StatusCodes.OK, "JOB-PORTAL", "INSERT-JOB-DATA", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "JOB-PORTAL", "INSERT-JOB-DATA", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
    
    updateJob = async  (req: any, res: any)=> {
        try {
            const jobPortalOperationDao = new JobPortalOperationDao();
            let result = await jobPortalOperationDao.updateJob(req);
            let response = new Response(StatusCodes.OK, "JOB-PORTAL", "UPDATE-JOB-DATA", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "JOB-PORTAL", "UPDATE-JOB-DATA", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    deleteJob = async (req: any, res: any) => {
        try {
            const jobPortalOperationDao = new JobPortalOperationDao();
            let result = await jobPortalOperationDao.deleteJob(req);
            let response = new Response(StatusCodes.OK, "JOB-PORTAL", "DELETE-JOB-DATA", "Success", result);
            res.status(StatusCodes.OK).send(response);
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            let response = new Response(StatusCodes.INTERNAL_SERVER_ERROR, "JOB-PORTAL", "DELETE-JOB-DATA", e.message, [{"stack_trace": e.stack}]);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        }
    }
}

module.exports = new JobPortalOperationController();
