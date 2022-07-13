const { Router } = require("express")

const userRouter = require("./users.routes")
const notesRouter = require("./notes.routes")
const tagsRouter = require("./tags.routes")
 
const routes = Router()

routes.use("/users", userRouter)
routes.use("/movie_notes", notesRouter)
routes.use("/movie_tags", tagsRouter)

module.exports = routes