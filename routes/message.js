const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message')

router.get('/', (req, res) => {
    res.render('profile');
});

router.post('/direct', messageController.directMessage)

module.exports = router;