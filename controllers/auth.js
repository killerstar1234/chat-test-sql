const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('../config/config')
const cookieParser = require('cookie-parser');
const { createTokens } = require('../JWT')



exports.register = (req, res) => {
    const { name, password, email, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, queryEmail) => {
        // If we have a err with the query log it
        if(err) {
            console.log(err);
        }
        // Check if the email is already in use
        if(queryEmail.length > 0) {
            return res.status(400).render('register', {
                message: 'That email is taken'
            })
        } 
        // Checks if passwords dont match
        else if(password != passwordConfirm) {
            return res.status(400).render('register', {
                message: 'Passwords Do Not Match'
            })
        }
        // Creating Hash pass to put in database
        let hashedPass = await bcrypt.hash(password, 8);
        // Put data into database
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPass }, (err, result) => {
        // Check if we have a err with the query
        if(err) {
            console.log(err);
        }
        // If not return the page you want to send the new user
        else {

            // creating a token to log in with
            const tokenData = {name: name, email: email}
            const accessToken = createTokens(tokenData)

            res.cookie('access-token', accessToken, {
                    maxAge: 2592000000,
                    httpOnly: true
           })

           db.query('INSERT INTO token SET ?', { email: email, name: name, token: accessToken })

            return res.status(200).render('profile', {
                message: 'User Added'
            })
        
        
        }

        })

    })

}

exports.login = async (req, res) => {
    const { name, email, password } = req.body;
    // Checking if there is really a acount with the email registered
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, queryEmail) => {
        // Checking if there is a err
        if(err) {
            console.log(err);
        }
        // Checking if there is a acount signed in with the email
        if(queryEmail.length === 0) {
            return res.status(400).render('login', {
                message: 'Incorrect Data'
            })
        }
        // Check if the name and password are right
        else if(name !== queryEmail[0].name) {
            return res.status(400).render('login', {
                message: 'Inccorrect Data'
            })
        } else {
        // Check if the password is correct
        const dbPass = queryEmail[0].password;
        bcrypt.compare(password, dbPass).then(match => {
            if(!match) {
                return res.status(400).render('login', {
                    message: 'Incorrect Data'
                })
            } else {
                // Users data is all correct to log in

                // creating a token to log in with
                const tokenData = {name: queryEmail[0].name, email: queryEmail[0].email}
                const accessToken = createTokens(tokenData)

                res.cookie('access-token', accessToken, {
                    maxAge: 2592000000,
                    httpOnly: true
                })

                db.query('INSERT INTO token SET ?', { email: email, name: name, token: accessToken })

                res.status(200).render('profile', {
                    message: 'Logged In'
                })
            }
        })
        
    }

    })

}