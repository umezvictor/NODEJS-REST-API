// module.exports = function(server){
//     //this will work, but i choose arow functions instead
// }

const errors = require('restify-errors');//handle errors elegantly with restify  errors

const Customer = require('../model/Customer');
const config = require('../config');
const rjwt = require('restify-jwt-community'); //protect all routes except auth

//export a function 
module.exports = server => {
    //get all customers
    server.get('/customers', async (req, res, next) => {
        //with restify, always call next when done with your route
        //you need async to use await
        //res.send({msg: 'test'});
        try {
            const customers = await Customer.find({}); //returns all customers
        res.send(customers);
        next();
        }catch(err){
           //handle errors with restify errors
           return next(new errors.InvalidContentError(err)); 
        }
        
    });


    //get single customer
    server.get('/customers/:id', async (req, res, next) => {
        //with restify, always call next when done with your route
        //you need async to use await
        //res.send({msg: 'test'});
        try {
            const customer = await Customer.findById(req.params.id); //returns all customers
        res.send(customer);
        next();
        }catch(err){
           //handle errors with restify errors
           return next(new errors.ResourceNotFoundError(`no customer with the id of ${req.params.id}`)); 
        }
        
    });


    //add customer
    //this route is protected
    server.post('/customers', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        //check if content type is json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError(err));
        }

        //use destructuring to get data
        const { name, email, balance } = req.body;
        
        const customer = new Customer({
            //name:name format for es5 below
            name, //es6 format
            email,
            balance
        });

        //save to db
        try{
            const newCustomer = await customer.save();
            res.send(201); //all ok
        } catch(err){
            return next(new errors.InternalError(err.message));
        }
    });


    //update customer - PROTECTED ROUTE 
    server.put('/customers/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        //check if content type is json
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError(err));
        }

        //save to db
        try{
            const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200); //all ok
            next();
        } catch(err){
            return next(new errors.ResourceNotFoundError(`there is no customer with id of ${req.params.id}`));
        }
    });

    //delete customer
    //restify uses .del for delete

    //in place of assync await, .then with .catch can be used

    server.del('/customers/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
        try{
            const customer = await Customer.findOneAndRemove({ _id: req.params.id });
            res.send(204); //no content -  delete successful
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`there is no customer with id of ${req.params.id}`));
        }
    })

};