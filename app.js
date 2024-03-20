require("dotenv").config({path:"./.env"})
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")

// Db connection 
require("./models/database.js").connectDatabase()

app.use(cors({credentials:true, origin:true}))

// logger
const logger = require("morgan")
app.use(logger("tiny"))

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// session and cookie
const session = require("express-session")
const cookieparser = require("cookie-parser")
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:process.env.EXPRESS_SESSION_SECRET,
  cookie: { secure:true }
})) 

app.use(cookieparser())

// express file-upload
const fileUpload = require("express-fileupload")
app.use(fileUpload())

// routes
app.use("/",require("./routes/indexRoutes.js"))

// ErrorHandler
const ErrorHandler = require("./utils/ErrorHandler.js")
const { generatedErrors } = require("./middleware/errors.js")
app.all("*", (req,res,next)=>{
    next(new ErrorHandler(`Requested Url Not Found ${req.url}` , 404 ))
})

app.use(generatedErrors)

app.listen(process.env.PORT, 
  console.log(`server is running on ${process.env.PORT}`) 
)