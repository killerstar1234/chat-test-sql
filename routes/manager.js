const express = require('express');
const router = express.Router();

const managerController = require('../controllers/manager')

router.get('/', managerController.login);
router.get('/login', managerController.login)

module.exports = router;