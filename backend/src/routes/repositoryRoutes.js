const express = require('express');
const router = express.Router();
const { indexRepository } = require('../controllers/repositoryController');

router.post('/index', indexRepository);

module.exports = router;
