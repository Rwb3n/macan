// Builds: infra
// Writes the views of the map into model/views/. Run after every change to model/, or to a module's Builds line.
import { mkdirSync, writeFileSync } from "node:fs"
import { html, markdown, openMarkdown, traceMarkdown } from "../model/render"

mkdirSync("model/views", { recursive: true })
writeFileSync("model/views/map.md", markdown())
writeFileSync("model/views/trace.md", traceMarkdown())
writeFileSync("model/views/open.md", openMarkdown())
writeFileSync("model/views/map.html", html())
console.log("Wrote model/views/{map,trace,open}.md and map.html.")
