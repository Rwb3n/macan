// Writes the views of the map into model/views/. Run after every change to model/.
import { mkdirSync, writeFileSync } from "node:fs"
import { html, markdown } from "../model/render"

mkdirSync("model/views", { recursive: true })
writeFileSync("model/views/model.md", markdown())
writeFileSync("model/views/model.html", html())
console.log("Wrote model/views/model.md and model/views/model.html.")
