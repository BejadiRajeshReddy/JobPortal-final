export {};
const express = require('express');
import {authorize} from '../middleware/JWTProvider';

const router = express.Router();
const authController = require('../controller/AuthController');

router.post('/login', authController.login);
router.post('/updateUserDetails', authController.updateUserDetails);
router.post('/changePassword', authController.changePassword);
router.post('/logout', authController.logout);
router.post('/signUp', authController.signUp);
router.get('/testApi', authController.testApi);
module.exports = router;
