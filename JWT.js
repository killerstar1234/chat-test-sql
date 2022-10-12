const {sign, verify} = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign({ name: user.name, email: user.email }, "kk908vkm778151463")

    return accessToken;
}

const validateToken = (req, res, next) => {

    const accessToken = req.cookies["access-token"]

    if(!accessToken) return res.status(400).render('login', {
        message: "Need to be logged into a account to view this"
    });

    try {
        const validToken = verify(accessToken, "kk908vkm778151463")
        if(validToken) {
            req.authenticated = true;
            return next();
        }
    } catch(err) {
        return res.status(400).render('login', {
            message: "Incorrect Token"
        });
    }

}

module.exports = { createTokens, validateToken }