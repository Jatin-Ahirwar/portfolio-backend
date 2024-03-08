const { catchAsyncErrors } = require("../middleware/catchAsyncErrors")
const userModel = require("../models/userModel.js")
const { SendToken } = require("../utils/SendToken.js")
const ErrorHandler = require("../utils/ErrorHandler.js")
const VideoCompressor = require("../utils/VideoCompressor.js")
const imagekit = require("../utils/imagekit.js").initImageKit()
const frontModel = require("../models/frontend.js")
const BackModel = require("../models/backend.js")
const MernModel = require("../models/mern.js")
const UiUxModel = require("../models/uiux.js")
const { ImageCompressor } = require("../utils/ImageCompressor.js")
const path = require("path")

exports.homepage = catchAsyncErrors(async(req,res,next)=>{
    res.json("hii")
})

exports.admin = catchAsyncErrors(async (req,res,next)=>{
    const admin = await userModel.findById(req.id)
    .populate("frontend")
    // .populate("backend")
    // .populate("mern")
    // .populate("uiux")
    res.json(admin)
})

exports.signup = catchAsyncErrors(async(req,res,next)=>{
    const user = await new userModel(req.body).save()
    SendToken(user,200,res)
})

exports.signin = catchAsyncErrors(async (req,res,next)=>{
    
    const user = await userModel.findOne({email : req.body.email}).select("+password").exec()
    if(!user) {
            return next (new ErrorHandler("user not exist with this email. " , 404))
    }
    const ismatch = user.comparepassword(req.body.password)
    
    if(!ismatch) return next (new ErrorHandler("wrong Credentials",500))
    
    SendToken(user,200,res)
})

exports.signout = catchAsyncErrors(async(req,res,next)=>{
    res.clearCookie("token")
    res.json({message:"Successfully Signed Out."})
})

exports.createFrontendProject = catchAsyncErrors(async (req, res, next) => {
    
    const userID = await userModel.findById(req.id).exec();
    const { aboutProject , projectTitle , projectName , projectType } = req.body
    let projectPoster = req.files?.projectPoster;
    let projectVideo = req.files?.projectVideo;
    let files = req.files?.images;
    
    const uploadedprojectPoster = [];
    const uploadedprojectVideo = [];
    const uploadedFiles = [];
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/avif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4'];

    if (!Array.isArray(projectPoster)) {
        projectPoster = [projectPoster];
    }

    for (const file of projectPoster) {
        if (!allowedImageTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                    message: `File type ${file.mimetype} is not supported for projectPoster. Allowed image types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
            
        }
        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-poster-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });
    
        uploadedprojectPoster.push({ fileId, url });
    }

    if (projectVideo) {
        if (!Array.isArray(projectVideo)) {
            projectVideo = [projectVideo];
        }

        for (const file of projectVideo) {
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `File type ${file.mimetype} is not supported for projectVideo. Allowed video type: MP4`,
                });
            }

            const compressedBuffer = await VideoCompressor(file.data);
            const modifiedName = `Frontend-compressed-projectVideo-${Date.now()}${path.extname(file.name)}`;
            const { fileId, url } = await imagekit.upload({
                file: compressedBuffer,
                fileName: modifiedName,
            });

            uploadedprojectVideo.push({ fileId, url });
        }
    }

    if (!Array.isArray(files)) {
        // If it's not an array, convert it to an array
        files = [files];
    }

    for (const file of files) {
        if(allowedImageTypes.includes(file.mimetype)){

        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-images-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });

        uploadedFiles.push({ fileId, url  });
    }
        else {
            return res.status(400).json({
                success: false,
                message: `File type ${file.mimetype} is not supported. Allowed file types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
        }
    }

        const newFrontend = new frontModel({
            aboutProject,
            projectTitle, 
            projectName,
            projectType,            
            projectPoster: {
                fileId: uploadedprojectPoster[0].fileId,
                url: uploadedprojectPoster[0].url,
            },
            images: uploadedFiles,

        });
        
        if (uploadedprojectVideo.length > 0) {
            newFrontend.projectVideo = {
                fileId: uploadedprojectVideo[0].fileId,
                url: uploadedprojectVideo[0].url,
            };
        }

        newFrontend.user = userID._id
        userID.frontend.push(newFrontend._id);
        await newFrontend.save();
        await userID.save();

        res.status(200).json({
            success: true,
            message: "Frontend Project Uploaded successfully",
            // Frontend: newFrontend,
        });
});

exports.createBackendProject = catchAsyncErrors(async (req, res, next) => {
    
    const userID = await userModel.findById(req.id).exec();
    const { aboutProject , projectTitle , projectName , projectType } = req.body
    let projectPoster = req.files?.projectPoster;
    let projectVideo = req.files?.projectVideo;
    let files = req.files?.images;
    
    const uploadedprojectPoster = [];
    const uploadedprojectVideo = [];
    const uploadedFiles = [];
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/avif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4'];

    if (!Array.isArray(projectPoster)) {
        projectPoster = [projectPoster];
    }

    for (const file of projectPoster) {
        if (!allowedImageTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                    message: `File type ${file.mimetype} is not supported for projectPoster. Allowed image types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
            
        }
        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-poster-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });
    
        uploadedprojectPoster.push({ fileId, url });
    }

    if (projectVideo) {
        if (!Array.isArray(projectVideo)) {
            projectVideo = [projectVideo];
        }

        for (const file of projectVideo) {
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `File type ${file.mimetype} is not supported for projectVideo. Allowed video type: MP4`,
                });
            }

            const compressedBuffer = await VideoCompressor(file.data);
            const modifiedName = `Frontend-compressed-projectVideo-${Date.now()}${path.extname(file.name)}`;
            const { fileId, url } = await imagekit.upload({
                file: compressedBuffer,
                fileName: modifiedName,
            });

            uploadedprojectVideo.push({ fileId, url });
        }
    }

    if (!Array.isArray(files)) {
        // If it's not an array, convert it to an array
        files = [files];
    }

    for (const file of files) {
        if(allowedImageTypes.includes(file.mimetype)){

        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-images-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });

        uploadedFiles.push({ fileId, url  });
    }
        else {
            return res.status(400).json({
                success: false,
                message: `File type ${file.mimetype} is not supported. Allowed file types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
        }
    }

        const newFrontend = new frontModel({
            aboutProject,
            projectTitle, 
            projectName,
            projectType,            
            projectPoster: {
                fileId: uploadedprojectPoster[0].fileId,
                url: uploadedprojectPoster[0].url,
            },
            images: uploadedFiles,

        });
        
        if (uploadedprojectVideo.length > 0) {
            newFrontend.projectVideo = {
                fileId: uploadedprojectVideo[0].fileId,
                url: uploadedprojectVideo[0].url,
            };
        }

        newFrontend.user = userID._id
        userID.frontend.push(newFrontend._id);
        await newFrontend.save();
        await userID.save();

        res.status(200).json({
            success: true,
            message: "Frontend Project Uploaded successfully",
            // Frontend: newFrontend,
        });
});

exports.createMernProject = catchAsyncErrors(async (req, res, next) => {
    
    const userID = await userModel.findById(req.id).exec();
    const { aboutProject , projectTitle , projectName , projectType } = req.body
    let projectPoster = req.files?.projectPoster;
    let projectVideo = req.files?.projectVideo;
    let files = req.files?.images;
    
    const uploadedprojectPoster = [];
    const uploadedprojectVideo = [];
    const uploadedFiles = [];
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/avif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4'];

    if (!Array.isArray(projectPoster)) {
        projectPoster = [projectPoster];
    }

    for (const file of projectPoster) {
        if (!allowedImageTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                    message: `File type ${file.mimetype} is not supported for projectPoster. Allowed image types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
            
        }
        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-poster-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });
    
        uploadedprojectPoster.push({ fileId, url });
    }

    if (projectVideo) {
        if (!Array.isArray(projectVideo)) {
            projectVideo = [projectVideo];
        }

        for (const file of projectVideo) {
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `File type ${file.mimetype} is not supported for projectVideo. Allowed video type: MP4`,
                });
            }

            const compressedBuffer = await VideoCompressor(file.data);
            const modifiedName = `Frontend-compressed-projectVideo-${Date.now()}${path.extname(file.name)}`;
            const { fileId, url } = await imagekit.upload({
                file: compressedBuffer,
                fileName: modifiedName,
            });

            uploadedprojectVideo.push({ fileId, url });
        }
    }

    if (!Array.isArray(files)) {
        // If it's not an array, convert it to an array
        files = [files];
    }

    for (const file of files) {
        if(allowedImageTypes.includes(file.mimetype)){

        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-images-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });

        uploadedFiles.push({ fileId, url  });
    }
        else {
            return res.status(400).json({
                success: false,
                message: `File type ${file.mimetype} is not supported. Allowed file types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
        }
    }

        const newFrontend = new frontModel({
            aboutProject,
            projectTitle, 
            projectName,
            projectType,            
            projectPoster: {
                fileId: uploadedprojectPoster[0].fileId,
                url: uploadedprojectPoster[0].url,
            },
            images: uploadedFiles,

        });
        
        if (uploadedprojectVideo.length > 0) {
            newFrontend.projectVideo = {
                fileId: uploadedprojectVideo[0].fileId,
                url: uploadedprojectVideo[0].url,
            };
        }

        newFrontend.user = userID._id
        userID.frontend.push(newFrontend._id);
        await newFrontend.save();
        await userID.save();

        res.status(200).json({
            success: true,
            message: "Frontend Project Uploaded successfully",
            // Frontend: newFrontend,
        });
});

exports.createUiUxProject = catchAsyncErrors(async (req, res, next) => {
    
    const userID = await userModel.findById(req.id).exec();
    const { aboutProject , projectTitle , projectName , projectType } = req.body
    let projectPoster = req.files?.projectPoster;
    let projectVideo = req.files?.projectVideo;
    let files = req.files?.images;
    
    const uploadedprojectPoster = [];
    const uploadedprojectVideo = [];
    const uploadedFiles = [];
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/avif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4'];

    if (!Array.isArray(projectPoster)) {
        projectPoster = [projectPoster];
    }

    for (const file of projectPoster) {
        if (!allowedImageTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                    message: `File type ${file.mimetype} is not supported for projectPoster. Allowed image types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
            
        }
        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-poster-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });
    
        uploadedprojectPoster.push({ fileId, url });
    }

    if (projectVideo) {
        if (!Array.isArray(projectVideo)) {
            projectVideo = [projectVideo];
        }

        for (const file of projectVideo) {
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: `File type ${file.mimetype} is not supported for projectVideo. Allowed video type: MP4`,
                });
            }

            const compressedBuffer = await VideoCompressor(file.data);
            const modifiedName = `Frontend-compressed-projectVideo-${Date.now()}${path.extname(file.name)}`;
            const { fileId, url } = await imagekit.upload({
                file: compressedBuffer,
                fileName: modifiedName,
            });

            uploadedprojectVideo.push({ fileId, url });
        }
    }

    if (!Array.isArray(files)) {
        // If it's not an array, convert it to an array
        files = [files];
    }

    for (const file of files) {
        if(allowedImageTypes.includes(file.mimetype)){

        const compressedBuffer = await ImageCompressor(file.data);
        const modifiedName = `Frontend-compressed-images-${Date.now()}${path.extname(file.name)}`;
        const { fileId, url } = await imagekit.upload({
            file: compressedBuffer,
            fileName: modifiedName,
        });

        uploadedFiles.push({ fileId, url  });
    }
        else {
            return res.status(400).json({
                success: false,
                message: `File type ${file.mimetype} is not supported. Allowed file types: PNG, JPG, JPEG, SVG, AVIF, WebP`,
            });
        }
    }

        const newFrontend = new frontModel({
            aboutProject,
            projectTitle, 
            projectName,
            projectType,            
            projectPoster: {
                fileId: uploadedprojectPoster[0].fileId,
                url: uploadedprojectPoster[0].url,
            },
            images: uploadedFiles,

        });
        
        if (uploadedprojectVideo.length > 0) {
            newFrontend.projectVideo = {
                fileId: uploadedprojectVideo[0].fileId,
                url: uploadedprojectVideo[0].url,
            };
        }

        newFrontend.user = userID._id
        userID.frontend.push(newFrontend._id);
        await newFrontend.save();
        await userID.save();

        res.status(200).json({
            success: true,
            message: "Frontend Project Uploaded successfully",
            // Frontend: newFrontend,
        });
});
