const User = require('../../Models/User')
const crypto = require('crypto')

module.exports = ResetPassword = async (req,res,next) => {
    const {password} = req.body;
    if(!password){
        return res.status(500).json({
            success : false,
            error : 'Please provide password'
        })
    }
    const resetToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")

    try{
        const user = await User.findOne({
            resetPasswordToken : resetToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if(!user){
            return res.status(400).json({
                success : false,
                error : "Password update failed"
            })
        }
        user.password = req.body.password;
            /* After password reset, reset token values in DB */
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Password Updated Success",
        })
    }catch(error){
        return res.status(500).send(error)
    }
} 