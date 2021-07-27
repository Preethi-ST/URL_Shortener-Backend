const User = require('../../Models/User')
const jwt = require('jsonwebtoken')
exports.Login = async (req,res,next) => {

    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success : false,
            error : 'Please provide both Email and Password'
        })
    }

    /* check if the email exists in DB */

    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({
            success : false,
            error : 'Inavlid Credentials'
        })
    }else{
        
        /* check is password matches */

        const isMatch = await user.matchPassword(password)
        console.log(`isMatch ${isMatch}`)
        
        if(!isMatch){
            return res.status(401).json({
                success : false,
                error : 'Inavlid Credentials'
            })
        }
        else{
            /* Generate Token */

            const token = await user.getToken();

            return res
            .status(200)
            .json({
                success : true,
                message : "Login Success",
                token
            })
        }
    }

}
/* Checking if user logged in without using middleware to validate in frontend */
exports.isLoggedIn = async (req,res,next) => {
    
    let logintoken;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        logintoken = req.headers.authorization.split(' ')[1];
    }

    if(!logintoken){
        console.log("No token")
        return res.json({
            success : false,
            message : "Not authorized for this route"
        })
    }
    try{
        const verified = await jwt.verify(logintoken, process.env.Private_Route_SECRET);

        const result = await User.findOne({email : verified.email},'username email')
        return res.send({
            success : true,
            message : "Verified User",
            username : result.username,
            email : result.email
        }) 
    }catch(error){
        console.log(error)
        return res.json({
            success : false,
            message : "Not authorized for this route"
        })
    }
}

