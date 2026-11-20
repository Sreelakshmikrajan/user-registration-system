const express = require("express");
const fs = require("fs");
const path = require("path"); 
const session = require("express-session");
const app = express();
const PORT = 5000;

const userRoutes = require("./routes/userRoutes");
//middleware
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET ||
    "dev-secret-change-this",
    resave:false,
    saveUninitialized:false,
    cookie:{
        httponly:true,
        secure:false,
        sameSite:"lax",
        maxAge:1000*60*30
    }
}));

app.use(express.urlencoded({ extended: true }));

//fontend
app.use(express.static(path.join(__dirname,"public")));

//routes
app.use("/api", userRoutes);

//home
app.get("/", (req,res)=> {
    res.redirect("/register.html");
});


//server
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});