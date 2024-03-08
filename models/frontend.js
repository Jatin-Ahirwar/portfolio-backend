const mongoose = require("mongoose")

const frontendModel = new mongoose.Schema({
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    aboutProject:{
        type:String,
        require:true
    },
    projectTitle:{
        type:String,
        require:true
    },
    projectName:{
        type:String,
        require:true
    },
    projectType:{
        type:String,
        require:true
    },
    images:[{
        fileId: {
            type: String,
            required: [true, "File ID is required"]
        },
        url: {
            type: String,
            required: [true, "URL is required"]
        }
    }],
    projectPoster:{
        fileId: {
            type: String,
            required: [true, "File ID is required"]
        },
        url: {
            type: String,
            required: [true, "URL is required"]
        }
    },
    projectVideo:{
        fileId: {
            type: String,
        },
        url: {
            type: String,
        }
    },
})

const frontend =  mongoose.model("frontend" , frontendModel)

module.exports = frontend