const express = require("express")
const router = express.Router()
const { homepage, 
        signup, 
        signout, 
        signin, 
        createFrontendProject, 
        admin, 
        createBackendProject,
        createMernProject,
        createUiUxProject
} = require("../controllers/indexController.js")

const { isAuthenticated } = require("../middleware/auth.js")

router.get("/" , isAuthenticated ,homepage)

router.post("/admin" , isAuthenticated ,admin)

router.post("/signup" , signup)

router.post("/signin" , signin)

router.get("/signout" , isAuthenticated , signout)

router.post("/CreateFrontend", isAuthenticated , createFrontendProject)

router.post("/CreateBackend", isAuthenticated , createBackendProject)

router.post("/CreateMern", isAuthenticated , createMernProject)

router.post("/CreateUiUx", isAuthenticated , createUiUxProject)


module.exports = router