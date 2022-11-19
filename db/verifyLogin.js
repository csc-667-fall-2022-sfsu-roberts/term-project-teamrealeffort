const db = require("./index"); 

const VERIFY_USER = 'SELECT ("UserName", "Password") FROM "User" WHERE "UserName" = ${username} AND "Password" = ${password}'; 


const check = ({username, password}) => { 



 return db.one(VERIFY_USER, {username, password}); 


}; 






module.exports = {check}; 
