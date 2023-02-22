const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require('../models/userModel')
const mongoose  = require('mongoose')

//=====================================CREATE USER===============================================================

const createUser = async function (req, res) {
    try {
        const data = req.body
        const {name , dob, email, password} = data

        if(!name) return res.status(400).send({satatus: false, message: "name is requird"})
        if(!dob) return res.status(400).send({satatus: false, message: "dob is requird"})
        if(!email) return res.status(400).send({satatus: false, message: "email is requird"})
        if(!password) return res.status(400).send({satatus: false, message: "password is requird"})

        const isEmailUnique = await userModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: false, message: `email: ${email} already exist` });
        }

        //password bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        //Create User data after format =>email,password
        const UserData = {
            name: name,
            email: email,
            dob: dob,
            password: hashpassword
        };

        let userDatas = await userModel.create(UserData);
        return res.status(201).send({ status: true, message: "User created successfully", data : userDatas});

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//======================================LOGIN USER===============================================================

const userLogin = async function (req, res) {
    try {

        let data = req.body

        let { email, password } = data

        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }

        // check email for user
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });

        if (!password) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        // check password of existing user
        let pass = await bcrypt.compare(password, user.password)      //first parameter is the unhashed password and the second parameter is the hashed password stored in the db.
        if (!pass) return res.status(400).send({ status: false, message: "Password is not correct, Please provide valid password" });

        // using jwt for creating token
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                exp: Math.floor(Date.now() / 1000) + (60 * 3600),
                iat: new Date().getTime()
            },
            "xdhbcjnzdkc.mzdlmv/lmx/v/xm/mv/xm"
        );

        return res.status(200).send({ status: true, message: "User login successfully", data: { userId: user._id, token: token } });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//=======================================GET USER===============================================================

const getUser = async function (req, res) {
    try {
        let userId = req.Id

        if (mongoose.Types.ObjectId.isValid(userId) == false) {
            return res.status(400).send({ status: false, message: "UserId is not valid" });
        }

        let user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        return res.status(200).send({ status: true, message: 'User profile details', data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//=======================================GET USER===============================================================

const getUserById = async function (req, res) {
    try {
        let userId = req.params.id

        if (mongoose.Types.ObjectId.isValid(userId) == false) {
            return res.status(400).send({ status: false, message: "UserId is not valid" });
        }

        let user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        return res.status(200).send({ status: true, message: 'User profile details', data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


//=======================================GET USER===============================================================

const getAllUser = async function (req, res) {
    try {

        let user = await userModel.find({})
        if (user.length === 0) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        return res.status(200).send({ status: true, message: 'All User details', data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//========================================UPDATE USER===========================================================

const deleteUser = async function (req, res) {
    try {
        let userId = req.params.id

        if (mongoose.Types.ObjectId.isValid(userId) == false) {
            return res.status(400).send({ status: false, message: "UserId is not valid" });
        }

        let oldData = await userModel.findById({_id: userId})
        if(!oldData){
            return res.status(404).send({ status: false, message: "user not found" })
        }

        await userModel.findOneAndDelete({_id: userId})
        return res.status(200).send({ status: true, message: 'User profile deleted'})

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createUser, userLogin, getUser, getUserById, getAllUser, deleteUser}
