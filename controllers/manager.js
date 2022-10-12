
exports.login = (req, res) => {
    // We Are Rendering Home Page for the login Manager, You Can also go to this same page by going to /manager/login
    return res.render('manager');
    // Then We made the form in this page point to a auth manager login page
}