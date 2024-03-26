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
        createUiUxProject,
        findFrontendProjects,
        findSingleFrontendProjects,
        findBackendProjects,
        findSingleBackendProjects,
        findMernProjects,
        findSingleMernProjects,
        findUiUxProjects,
        findSingleUiUxProjects
} = require("../controllers/indexController.js")

const { isAuthenticated } = require("../middleware/auth.js")

router.get("/" , homepage)

router.post("/admin" , isAuthenticated ,admin)

router.post("/signup" , signup)

router.post("/signin" , signin)

router.get("/signout" , isAuthenticated , signout)

// _____________________________ Frontend _______________________________________

router.post("/CreateFrontend", isAuthenticated , createFrontendProject)

router.post("/findFrontendProjects", findFrontendProjects)

router.post("/findSingleFrontendProjects/:id", findSingleFrontendProjects)

// _____________________________ Frontend _______________________________________


// _____________________________ Backend _______________________________________

router.post("/CreateBackend", isAuthenticated , createBackendProject)

router.post("/findBackendProjects", findBackendProjects)

router.post("/findSingleBackendProjects/:id", findSingleBackendProjects)

// _____________________________ Mern _______________________________________

router.post("/CreateMern", isAuthenticated , createMernProject)

router.post("/findMernProjects", findMernProjects)

router.post("/findSingleMernProjects/:id", findSingleMernProjects)

// _____________________________ Mern _______________________________________

// _____________________________ UiUx _______________________________________

router.post("/CreateUiUx", isAuthenticated , createUiUxProject)

router.post("/findUiUxProjects", findUiUxProjects)

router.post("/findSingleUiUxProjects/:id", findSingleUiUxProjects)

// _____________________________ UiUx _______________________________________


module.exports = router