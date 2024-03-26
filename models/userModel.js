const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userModel = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true, "Email is required"],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password:{
        select:false,
        type:String,
        maxlength:[15,"Password should not exceed more than 15 characters"],
        minlength:[6,"Password should have atleast 6 characters"],
    },
    frontend :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"frontend"
    }],
    backend:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"backend"
    }],
    mern:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"mern"
    }],
    uiux:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"uiux"
    }],
},{timestamps:true})

userModel.pre("save", function(){
    if(!this.isModified ("password")){
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password , salt)
});

userModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password)
}


userModel.methods.getjwttoken = function () {
    return  jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

const user = mongoose.model("user" , userModel)

module.exports = user