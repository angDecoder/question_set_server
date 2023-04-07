const express = require('express');
const questionController = require('../controller/questionController');
const authorizeUser = require('../middleware/authorizeUser');
const checkOwner = require('../middleware/checkOwner');

const route = express.Router();

route.use(authorizeUser);
route.get('/:id',questionController.getAllQuestion);
route.put('/solve/:id',questionController.solveQuestion);

route.use(checkOwner);
route.post('/',questionController.addNewQuestion);
route.delete('/:id',questionController.deleteQuestion);

module.exports = route;