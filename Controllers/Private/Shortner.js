const Url = require('../../Models/Url')
const shortId = require('shortid');
const request = require('request');


exports.Shortner = async (req,res,next) => {
    const {longURL} = req.body;
    request.head(longURL, (error, result) => {
        const exists = !error && res.statusCode === 200;
        if(exists){
            shortenURL();
        }else{
            return res.status(404).send({
                message : "Not a valid URL"
           })
        }
    });

    const shortenURL = async () => {
            const shortUrl = shortId.generate()
            try{
                let url = await Url.findOne({longURL})
                if(url){
                    return res.status(200).json({
                        success : true,
                        url
                    })
                }
                url = new Url({longURL,shortUrl : `${process.env.baseURL}/${shortUrl}`,shortcode : shortUrl})
                await url.save()

                return res.status(200).json({
                    success : true,
                    url,

                })
            }catch(error){
                return res.status(500).json({
                    success : false,
                    error 
                })
            }
    }
    
 }

exports.RedirectShortUrl = async(req,res,next) => {
    try{
        const url = await Url.findOne({shortUrl : `${process.env.baseURL}/${req.params.shortcode}`})
        
        if(url){
            url.clicks = url.clicks + 1;
            await url.save();
            return res.redirect(url.longURL)
        }else{
            return res.status(404).json({
                success:false,
                error : "No such URL exists"
            })
        }
    }catch(error){
        return res.status(500).json({
            success:false,
            error : "Server Error"
        })
    }
}

