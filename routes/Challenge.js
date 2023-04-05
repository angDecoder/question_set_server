const express = require('express');
const authorizeUser = require('../middleware/authorizeUser');
const challengeController = require('../controller/challengeController');

const route = express.Router();

route.use(authorizeUser);
route.get('/',challengeController.getAllChallenges);
route.post('/add',challengeController.addNewChallenge);
route.delete('/:id',challengeController.deleteChallenge);

module.exports = route;