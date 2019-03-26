//mongodb://<dbuser>:<dbpassword>@ds151153.mlab.com:51153/mycustomers_api  
module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://victorblaze:#1989Vic.@ds151153.mlab.com:51153/mycustomers_api',
    JWT_SECRET: process.env.JWT_SECRET || 'secret1'
};