import {authorize} from "../middleware/JWTProvider";
import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const applicationController = require('../controller/ApplicationController');

// Application routes
router.post('/submitApplication', authorize, applicationController.submitApplication);
router.post('/getCandidateApplications', authorize, applicationController.getCandidateApplications);
router.post('/getJobApplications', authorize, applicationController.getJobApplications);
router.post('/updateApplicationStatus', authorize, applicationController.updateApplicationStatus);
router.post('/getRecruiterApplications', authorize, applicationController.getRecruiterApplications);
router.post('/deleteApplication', authorize, applicationController.deleteApplication);
router.post('/getApplicationStats', authorize, applicationController.getApplicationStats);

module.exports = router;