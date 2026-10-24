// Builds: U2, ST-U2.1, ST-U2.2, ST-U2.3
// The buyer's journey as the map states it (U2's stages), for the site to draw (D14).
import { stages } from "@model/what"
import type { JourneyStage } from "./components/journey"

export function buyerJourney(): JourneyStage[] {
  return stages.filter((s) => s.useCase === "U2").map(({ id, name, outcome, status }) => ({ id, name, outcome, status }))
}
