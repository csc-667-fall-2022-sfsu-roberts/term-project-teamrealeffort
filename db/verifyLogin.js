const db = require("./index"); 

const VERIFY_USER = 'SELECT ("Email", "Password") FROM "User" WHERE "Email" = ${email} AND "Password" = ${password}'; 


const check = ({email, password}) => { 



 return db.one(VERIFY_USER, {email, password}); 


}; 






module.exports = {check}; 
