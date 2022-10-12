
exports.directMessage = (req, res) => {

    // Put the message in the database

    console.log(req.body);

    res.render('profile', {message: "Sent Message"});

}