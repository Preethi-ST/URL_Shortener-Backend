const User = require('../../Models/User')
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const sendEmail = require('../../helpers/sendMail')

exports.Register = async(req,res,next) => {
    const {username,email,password} = req.body;
    
    try{
        /* Check if all details were present */
        if(!email || !password || !username){
            return res.status(400).json({
                success : false,
                error : "Please provide all the fields"
            })
        }
        /* Check if user exists in DB */
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success : false,
                error: 'This email was already taken. Try another'
            });
        }
        /* Create Token and Send Mail for account Activation */
        const accountActivationToken = jwt.sign(
            {username,email,password},
            process.env.Account_Activation_SECRET,
            {expiresIn:process.env.Account_Activation_Token_EXPIRE}
        )
            
        const accountActivateURL = `${process.env.Frontend_BaseURL}/Shortly/activateaccount/${accountActivationToken}`
        const message = 
        `
        <p>Hi ${username},</p>

        <p> Thanks for registration. We asure you that we will provide great service. Kindly follow below steps to activate your account </p>

        <p> Click on the below link to activate your account </p>

        <a href=${accountActivateURL}>${accountActivateURL}</a>

        <p>Link will be valid only for <strong>${process.env.Account_Activation_Token_EXPIRE}</strong></p>

        <p>${process.env.EMAIL_OWNER}</p>
        


        <p>Thanks & Regards,</p>
        PetiteURL Team
        `
        try{
            await sendEmail({
                to : email,
                subject : process.env.EMAIL_SUBJECT,
                text : message
            })
            return res.status(200).json({success:true,message : "Email Sent to activate your account! Make sure to check your spam mail and mark not as spam."})
        }catch(error){
            return res.status(500).json({success:false,message : "Email couldn't be sent"})
        }
    }catch(error){
        return res.status(500).send({
            success : false,
            error : error.message
        })
    }
}

exports.ActivateAccount = async (req,res,next) => {
    const ActivateToken = req.params.activateToken;
    /* Verify Token */
    const {username,email,password} = jwt.verify(
        ActivateToken,
        process.env.Account_Activation_SECRET,
        function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    success : false,
                    error: 'Expired link. Signup again'
                })
            }else{
                return decoded
            }
        }
    )
    try{
        const user = await User.create({
            username,
            email,
            password
        })
        const token = await user.getToken();
        return res
        .status(200)
        .json({
            success : true,
            message : "Account Activated Successfully",
            token
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            error: error.message
        })
    }
}