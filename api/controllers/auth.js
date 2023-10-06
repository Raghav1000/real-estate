import User from "../models/user.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/error.js"

const signUp = async (req, res, next) => {
    const { username, email, password } = req.body

    // hashing the password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    // creating new user in database
    const newUser = new User({ username, email, password: hashedPassword })

    try {
        await newUser.save()
        res.status(201).json('User created successfully')
    } catch (err) {
        next(err)
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, 'User not found'))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'))
        const { password: pass, ...restUserInformation } = validUser._doc
        // jwt token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(restUserInformation)
    } catch (err) {
        next(err)
    }
}

const googleAuth = async (req, res, next) => {
    try {
        const { username, email, photo } = req.body
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...restUserInformation } = user._doc
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(restUserInformation)

        } else {
            const generatePassword = Math.random().toString(36).slice(8)
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10)
            const newUser = new User({ username, email, password: hashedPassword, avatar: photo })
            await newUser.save()
            const { password: pass, ...restUserInformation } = newUser._doc
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(restUserInformation)
        }
    } catch (err) {
        next(err)
    }
}

const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been logged out')
    } catch (error) {
        next(error)
    }
}

export {
    signUp, signIn, googleAuth, signOut
}