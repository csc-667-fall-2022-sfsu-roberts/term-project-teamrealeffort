const session = require("express-session"); 

const sessionInstance = session({
    secret: "eofdhqoiehdgkadkq" , 
    cookie: { maxAge: 24 * 60 * 60}, 
    resave: false, 
    saveUninitialized: true, 


}); 

module.exports = sessionInstance; 