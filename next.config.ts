import type { NextConfig } from "next"

const config: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // AGENTS.md is the project's only rules file (D8); next dev must not append to it.
  agentRules: false,
}

export default config
