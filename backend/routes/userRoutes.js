const express = require('express'); 

const {getAllUsers, signUp, logIn} = require('../controllers/userControllers')

const userRouter = express.Router();

userRouter.get('/', getAllUsers);

userRouter.post('/signup', signUp);

userRouter.post('/login', logIn);

module.exports = userRouter;