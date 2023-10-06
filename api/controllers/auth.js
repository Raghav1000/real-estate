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

export {
    signUp, signIn
}