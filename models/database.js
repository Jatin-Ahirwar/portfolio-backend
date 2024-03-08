const mongoose = require("mongoose")


exports.connectDatabase = ()=>{
    try {
        mongoose.connect(process.env.MongoDB_URL)
        console.log("Database Connection Estaiblished !")        
    } catch (error) {
        console.log(error.message)
    }
}