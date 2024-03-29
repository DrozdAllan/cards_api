const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill all required fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists with this email')
    }

    // Hash password w bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({name, email, password: hashedPassword})

    if (user) {
        res.status(201).json({
            _id: user.id, name: user.name, email: user.email, token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Error in user creation')
    }
})

// @desc    Authenticate User
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // Check if user exists
    const user = await User.findOne({email})

    // Check the password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id, name: user.name, email: user.email, token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get User data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select('-email -password -createdAt -updatedAt');

    res.status(200).json(user);
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.FAKE_KEY, {
        expiresIn: '2d',
    })
}

module.exports = {registerUser, loginUser, getMe}
