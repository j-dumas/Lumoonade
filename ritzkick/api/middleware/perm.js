const Permission = require('../../db/model/permission')

const perm = async (req, res, next) => {
    try {
        const permission = await Permission.findOne({ user: req.user._id })
        if (!permission) {
            throw new Error('You do not have the permission to use that route. 1')
        }
        req.permission = permission
        next()
    } catch (e) {
        res.status(403).send({
            message: e.message
        })
    }
}

module.exports = perm