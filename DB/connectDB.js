require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true
        },() => console.log("MongoDB Connected"))  
    }catch(error){
        console.log(error);
    }
}

module.exports = connectDB;