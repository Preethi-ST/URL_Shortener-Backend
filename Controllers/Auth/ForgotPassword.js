const User = require('../../Models/User')
const sendEmail = require('../../helpers/sendMail')

module.exports = ForgotPassword = async (req,res,next) => {
    const {email} = req.body
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success : false,
                error : "Invalid Credentials"
            })
        }

        const resetToken = await user.getResetPasswordToken();
        await user.save(); 
        const resetURL = `${process.env.Frontend_BaseURL}/Shortly/resetpassword/${resetToken}`
        
        const message = 
        `
        <h1>You have requested to reset your password</h1>

        <p>Click on the below link to reset your password</p>
        <a href=${resetURL}>${resetURL}</a>

        <p> Link will be <strong>valid</strong> only for <strong>10 minutes </strong> </p>

        <p>${process.env.EMAIL_OWNER}</p>




        
        <p>Thanks & Regards,</p>
        <p>Shortly Team</p>
        `
        try{
            await sendEmail({
                to : email,
                subject : "Password Reset",
                text : message
            })
            return res.status(200).json({success:true,message : "Email Sent! Make sure to check your spam mail and mark not as spam."})
        }catch(error){
            return res.status(500).json({success:false,message : "Email couldn't be sent"})
        }
    }catch(error){
        return res.status(400).json({
            success : false,
            error : error
        })
    } 

}