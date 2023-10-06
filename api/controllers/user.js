import User from "../models/user.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

const getUser = (req, res) => {
    res.send('Get user route')
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthenticated'))
    try {
        if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10)
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })
        const { password, ...restUserInformation } = updatedUser._doc
        res.status(200).json(restUserInformation)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthenticated'))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json({ message: 'User has been deleted' })
    } catch (error) {
        next(error)
    }
}



export {
    getUser, updateUser, deleteUser
}