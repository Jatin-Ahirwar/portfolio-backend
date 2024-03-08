exports.generatedErrors = (err , req, res, next)=>{
    const statusCode = err.statusCode || 500
    
    if(err.name === "MongoServerError" && err.message.includes("E11000 duplicate key")){
        err.message = "User already exist with this email address ! "
    }

    res.status(statusCode).json({
        message: err.message,
        errorName: err.name,
        stack: err.stack
    })
} 