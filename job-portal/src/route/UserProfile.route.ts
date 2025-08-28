import {authorize} from "../middleware/JWTProvider";
import { Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const userProfileController = require('../controller/UserProfileController');

// User profile routes
router.post('/userprofile', authorize, userProfileController.getUserProfile);
router.post('/updateUserProfile', authorize, userProfileController.updateUserProfile);
router.get('/getAllUserProfiles', authorize, userProfileController.getAllUserProfiles);
router.post('/deleteUserProfile', authorize, userProfileController.deleteUserProfile);
router.post('/searchUserProfiles', authorize, userProfileController.searchUserProfiles);

module.exports = router;