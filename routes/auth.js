const bcrypt = require('bcryptjs');
const  mongoose = require('mongoose');
const User = mongoose.model('User'); //ifyou  try to import User model via  (../bla bla bla/model/User) it will give error

//create 'authenticate' method
exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            //ge user by email
            const user = await User.findOne({email});
            //match password if found 
            //compares the two passwords, db password and user entered password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    reject('Authentication failed');
                }
            });
        } catch (err) {
            //email not found
            reject('Authentication faiiled');
        }
    });
}