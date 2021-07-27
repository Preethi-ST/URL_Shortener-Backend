const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longURL : {
        type : String,
        required : [true,'Enter URL']
    },
    shortUrl: {
        type : String
    },
    shortcode :{
        type : String
    },
    clicks : {
        type : Number,
        default : 0
    },
    date: {type: Date, default: new Date()}
})

module.exports = mongoose.model('Url',urlSchema)