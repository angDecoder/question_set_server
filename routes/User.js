const express = require('express');
const route = express.Router();
const userController = require('../controller/userController');

route.post('/register',userController.registerUser);
route.post('/login',userController.loginUser);
route.post('/logout',userController.logout);
route.post('/refresh',userController.refresh);

module.exports = route;