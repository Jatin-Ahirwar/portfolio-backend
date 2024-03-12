const mongoose = require("mongoose")

const backendModel = new mongoose.Schema({
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
    linkedin:{
        type:String,
        default:""

    },
    github:{
        type:String,
        default:""

    },
    deployement:{
        type:String,
        default:""

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

const backend =  mongoose.model("backend" , backendModel)

module.exports = backend