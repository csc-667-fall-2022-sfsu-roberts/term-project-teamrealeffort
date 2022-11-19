const db = require("./index"); 

const REGISTER_USER = 'INSERT INTO "User" ("UserName", "Password", "Email") VALUES (${username}, ${password}, ${email}) RETURNING "UserId" '; 


const register = ({username, password, email }) => { 



 return db.one(REGISTER_USER, {username, password, email}); 


}; 






module.exports = {register}; 
