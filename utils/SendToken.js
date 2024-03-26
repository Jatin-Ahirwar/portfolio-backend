exports.SendToken = (user,statusCode,res)=>{
    const token = user.getjwttoken()

    const option = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 *1000
        ),
        httpOnly:true,
        secure:false                
    }
    res.status(statusCode)
    .cookie("token" , token , option )
    .json({ success:true , id:user._id , token })
}