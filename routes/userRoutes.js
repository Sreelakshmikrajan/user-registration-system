const experss = require("express");
const router = experss.Router();


const {registerUser,loginUser,getDashboard,logoutUser} = require("../controllers/userController");
const { sessions } = require("../middleware/userMiddleware");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/dashboard", sessions, getDashboard);
router.post("/logout",logoutUser);

module.exports = router ; 