const fs = require("fs");
const path = require("path");

//path
const usersFile = path.join(__dirname,"../users.json");

async function getUsers(){
    const data = await fs.promises.readFile( usersFile, "utf8")
    return JSON.parse(data);
}

async function saveUsers(users){
    const data = JSON.stringify(users,null,2);
   await fs.promises.writeFile(usersFile,data,"utf8");
} 

module.exports = {
    getUsers,
    saveUsers
};