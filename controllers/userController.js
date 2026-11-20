const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { error } = require("console");
const crypto = require("crypto");
 
async function registerUser(req,res){

    try{
    const {name, email , password, confirmPassword}=req.body;

if(!name || !email || !password || !confirmPassword){
   return res.status(400).json({
    message:"All feild required"
   });
}

const namepattern =/^[A-Za-z ]{3,50}$/;

if(!namepattern.test(name.trim())){
    return res.status(400).json({
        message:"name must contain 3-50 letters only"
    });
}
//email
const normalemail = email.trim().toLowerCase();
const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailpattern.test(normalemail)){
    return res.status(400).json({
        message:"invalid email format"
    });
}
//duplicate mail
const users = await userModel.getUsers();

const existingUser = users.find(
    user => user.email === normalemail
);
if(existingUser){
    return res.status(409).json({
        message:"email alredy registered"
    
    });
    
}

const passpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if(!passpattern.test(password)){
    return res.status(400).json({
        message:"password must contain 8 character,uppercase,lowercase,number and special char"
    });
}
if(password!==confirmPassword){
    return res.status(400).json({
        message:"password not match"
    })
}
const hashpass = await bcrypt.hash(password,10); 

//new user
const newuser = {
    id : crypto.randomUUID(),
    name : name,
    email : normalemail,
    password:hashpass
};
users.push(newuser);

await userModel.saveUsers(users);

return res.status(201).json({
    message:"User register sucessfully"
});
    }catch (error) {
    console.log(error);

    res.status(500).json({
        message: "internal server error",
        error: error.message
    });
}
}



async function loginUser(req,res) {
    try{
        const { email, password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Email and password required"
            });
        }
const normalemail = email.trim().toLowerCase();

     const users = await userModel.getUsers();

     const existingUser = users.find(user => user.email === normalemail);

     if(!existingUser){
        return res.status(401).json({
            message:"invalid email or password"
        });
     }
      const ispasswordvalid = await bcrypt.compare(
        password,existingUser.password
      );

      if(!ispasswordvalid){
        return res.status(401).json({
            message:"invalid email or password"
        });
      }
       
       req.session.user = {
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email

        };

      return res.status(200).json({
        message:"login successful",
        user:{
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email
        }

      });

    }catch(error){
        console.log(error);

        return res.status(500).json({
            message:"internal server error"
        });
    }
}


async function logoutUser(req, res) {
    try {

        await new Promise((resolve, reject) => {

            req.session.destroy((error) => {

                if (error) {
                    return reject(error);
                }

                resolve();
            });

        });

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}


async function getDashboard(req,res){
    try{
        const users = await userModel.getUsers();
        
        const loggedinUser = users.find(
            user =>user.id === req.session.user.id
        );

        if(!loggedinUser){
            return res.status(404).json({
                message:"user not found"
            });
        }
    return res.status(200).json({
        message:"welcome to dashboard",
        user:{
              id:loggedinUser.id,
              name:loggedinUser.name,
              email:loggedinUser.email
        } 
        
    });
}catch(error){
    console.log("error");

    return res.status(500).json({
        message:"internal server error"
    });
}
}

module.exports ={
    registerUser,
    loginUser,
    getDashboard,
    logoutUser
};
