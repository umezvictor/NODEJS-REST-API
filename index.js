const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community'); //protect all routes except auth

//init restify, i useed server which is the convention, but not 9 must
const server = restify.createServer();
//in express we use app, not mandatory
//middleware
server.use(restify.plugins.bodyParser());

//protect all routes except [/auth]
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth'] }));


server.listen(config.PORT, () => {
    //connect to mongoodb once server is listening
   mongoose.set('useFindAndModify', false);
    mongoose.connect(
        config.MONGODB_URI,
        { useNewUrlParser: true }
    );
});


//init db variable
const db = mongoose.connection;

//handle db error
db.on('error', (err) => console.log(err));

//handle opening of database

db.once('open', () => {
    //specify routes when db opens
    require('./routes/users')(server);
    require('./routes/customers')(server);//pass in an instance of server, cos it will be useed to creaate routes
    console.log(`server started on port ${config.PORT}`);
});