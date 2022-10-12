const express = require('express');
const { register } = require('../controllers/auth');
const router = express.Router();
const mysql = require('mysql');
const db = require('../config/config')
const { validateToken } = require('../JWT');

router.get('/', validateToken, (req, res) => {
    res.render('profile')
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/profile', validateToken, (req, res) => {

    const accessToken = req.cookies["access-token"];

    db.query(`SELECT * FROM token WHERE token = ?`, [accessToken], (err, results) => {
        if(err) {
            return console.log(err);
        }

        db.query('SELECT * FROM directmessages WHERE receiving = ?', [results[0].email], (err, messages) => {
        
        let data = [];

        messages.forEach(messageDetails => {
            data.push({senderName: messageDetails.name, senderEmail: messageDetails.email, messageContent: messageDetails.message})
        })
   
        res.render('profile', {
        name: results[0].name,
        email: results[0].email,
        messages: data
    
    }); 
        
    
    })


})


})

router.get('/settings', validateToken, (req, res) => {
    res.render('settings');
})


module.exports = router;