const {User} = require('../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.auth;

    User.findByToken(token, (error, user)=>{
        if(error) throw error;
        if(!user) return res.status(401).send('no access');

        req.token = token;
        next();
    })
}

module.exports = {auth};