import {authorize} from "../middleware/JWTProvider";
import { Request, Response } from 'express';

const express = require('express');

const router = express.Router();

const jobPortalOperationController = require('../controller/JobPortalOperationController');

router.get('/testApi', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Job Portal API is working!' });
});

router.post('/getJoblist',authorize, jobPortalOperationController.getJoblist);
router.get('/getAllJobs', jobPortalOperationController.getAllJobs); // Public endpoint, no auth required
router.post('/insertJob',authorize, jobPortalOperationController.insertJob);
router.post('/updateJob',authorize, jobPortalOperationController.updateJob);
router.post('/deleteJob',authorize, jobPortalOperationController.deleteJob);
module.exports = router;
