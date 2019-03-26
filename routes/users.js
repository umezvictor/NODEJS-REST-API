const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const auth = require('./auth');
const config = require('../config');

module.exports = server => {
    //resgister user
    server.post('/register', (req, res, next) => {
        const { email, password } = req.body;

        //instantiate the User model
        const user = new User({
            email,
            password
        });

        //encrypt password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                //hash password
                user.password = hash;
                //save user
                try{
                    const newUser = await user.save();
                    res.send(201);
                    next();
                } catch(err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });

    //auth user
    server.post('/auth', async (req, res, next) => {
        //get email and password, afer it is sent along this route
        //pull it out from the requestbody using destructuring
        const { email, password } = req.body;
        try {
            //authenticate user
            const user = await auth.authenticate(email, password);
            
            //create jwt
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            //retrieve 'issued at  iat and exp' and expiration
            const { iat, exp } = jwt.decode(token);
            //respond with token
            res.send({ iat, exp, token });
            next();
            //console.log(user);
        } catch (err) {
            return next(new errors.UnauthorizedError(err));
        }
    });
}