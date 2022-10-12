const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path')
const db = require('./config/config')
const { validateToken } = require('./JWT');

db.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected To Database')
    }
})

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));


app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))
app.use('/manager', validateToken, require('./routes/manager'))
app.use('/message', validateToken, require('./routes/message'))

app.listen(3000, () => {
    console.log('Server Online at port 3000');
})