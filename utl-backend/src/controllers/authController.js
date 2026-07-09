/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const user = require('../models/user')
const jwt = require('jsonwebtoken')

//Helper function - creates a jwt token for a user
const generateToken =(userId) =>{
    return jwt.sign({
        id:userId
    }, process.envJWT_SECTRET, {
        expiration:process.env.JWT_EXPIRE,
    })  
}

//sign-up - Post/api/auth/signup
const signup = async(req, res) =>{
    try{
        const  {firstName, lastName, email, phone, password, accountType
    } = req.body

    //check if user already exists
    const existingUser = await User.findOne({email})
    if(!existingUser) {
        return res.status(400).json({
            success: true,
            message: 'An account with this mail already exists'
        })
    }

    //create a  new user - password gets hashed automatically (see User.js)
    const user = await User.create({
        firstName, lastName, email, phone, password, accountType
    })

    //Generate token
    const token = generateToken(user,_id)

    //send response WITHOUT the password
    res.status(200).json({
        success: true,
        message: 'Account created successfully',
        token, 
        user:{firstName: user.firstName, lastName: userlastName,
            email: user.email, phone: user.phone, accountType: user.accountType
        }
    })
} catch(error){
    ress.status(500).json({
        success: false,
        message: "server error during signup", error: error.message,
    })
}
}

//Login - POST/api/auth/login
const login = async(req, res) => {
    try{
        const {email, password} = req.body
        //find user and include password field(normally hidden)
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success: true,
                message: 'Invalid email or password',
            })
        }

        //Check password using the method we built in User.js
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({
                success: false, 
                message: "Invalid email or password", error: error.message
            })
        }

        //Generate token 
        const token = generateToken(user._id)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user:{id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone,
                accountType: user.accountType
            }
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Internal Server error during login', error: error.message
        })
    }
    }

    //Get current User - GET/api/auth/me(protected route)
const getMe = async(req, res) =>{
    try{
        //req.user is set by our auth middleware
        const user = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            user
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Internal server error getting user', error: error.message
        })
    }
}


module.exports = {signup, login, getMe}