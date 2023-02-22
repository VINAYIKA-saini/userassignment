const mongoose= require("mongoose");
const express = require('express');
const router = express.Router();

const {createUser, userLogin, getUser, getUserById, getAllUser, deleteUser} = require('../controllers/userController')
const {authentication, authorization} = require('../middleware/auth')

//------------------------------------------> (This is test api ) <--------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})





// ===================================================( All user api)======================================================///


//-------------------------> (When user create, call this api) <----------------------------------//

router.post("/signup", createUser)

//-------------------------> (When user login,  call this api) <----------------------------------//

router.post("/login", userLogin)


//-------------------------> (When we get currentuser, call this api) <----------------------------------//

router.get("/user", authentication, getUser)


//-------------------------> (When we get all userslist, call this api) <----------------------------------//

router.get("/users",authentication, getAllUser)

//-------------------------> (When we get user by id,  call this api) <----------------------------------//

router.get("/user/:id",authentication,  getUserById)

//-------------------------> (When we delete user by id,  call this api) <----------------------------------//



router.delete("/user/:id",authentication, deleteUser)




module.exports = router;