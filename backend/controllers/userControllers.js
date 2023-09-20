const User = require('../models/userModel')

const bcrypt = require('bcryptjs')

const  getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find();
        if(!users) {
            res.status(404).json({message : "No user found"})
        }
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}

const signUp = async(req, res, next) => {
    const { name, email, password} = req.body
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already existed!!! Login instead"})
        }
       
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error.message)
        
    }
    const hashedpassword = bcrypt.hashSync(password)
    const user = new User(
        {
            name,
            email,
            password : hashedpassword,
            blogs : []
        }
    )

    try {
        await user.save();
        res.status(200).json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
}

const logIn = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        console.log('qbucacadch',existingUser);
        if(!existingUser) {
            return res.status(404).json({message : "No such user exist!!! Signup instead"})
        }
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({message : "Incorrect password"})
        }
        res.status(200).json({message : "Login successfull!!!"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message})
    }
}





module.exports = {getAllUsers, signUp, logIn};
