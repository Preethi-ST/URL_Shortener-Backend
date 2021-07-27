const Url = require('../../Models/Url')

module.exports = AllURL = async (req,res,next) => {
    try{
        let urls = await Url.find({},'longURL shortUrl clicks',function(err,result){
            if(err){
                throw err;
            }
        }); 
        //console.log(urls)
        return res.status(200).json({
            success : true,
            urls
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            error
        })
    }
        
    
}