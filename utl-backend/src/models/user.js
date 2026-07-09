/* eslint-disable no-undef */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ✅ user schema = blueprint for a user documnet looks like in MongoDB
const userSchema = new mongoose.Schema({
    firstName: {type: string, required:[true, 'First name is required'], trim: true},
    lastName: {type: string, required: [true, 'Last name is required'], trim: true},
    email: {type: string, required: [true, 'Email is required'], unique: true, 
        lowercase: true, trim: true},
    phone: {type: string, required: [true, 'Phone number is required'],},
    password: {type: string, required: [true, 'Password is required'], minlength: 8},
    accounntType: {type: string, enum: ['client', 'seller', 'learner', 'crypto'], 
        default: 'client'},
    isVerified: {type: boolean, default: false},
}, {timestamps: true}) //automatically adds createdAt and updatedAt fields
    
// ✅ before saving a user, automatically hash(scramble) their password
userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) 
        return next() //only hash if password is new or changed

    const salt = await bcrypt.genSalt(10) //generate a random salt
    this.password = await bcrypt.hash(this.password, salt)
    next() //continue saving the user
})

// method to check if entered password matches the hashed password in DB
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const user = mongoose.model('user', userSchema)

module.exports = user;