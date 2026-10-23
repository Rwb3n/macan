import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

export type Mail = { to: string; subject: string; text: string }
export type Mailer = { send(mail: Mail): Promise<void> }

// Outside production, mail goes to data/outbox/ (one file per message) so a demo can show it.
// Production has no mailer yet and refuses to send rather than pretend (fail loudly).
export function mailer(): Mailer {
  if (process.env.NODE_ENV === "production" && !process.env.OUTBOX_DIR) {
    return { send: async () => { throw new Error("No mail provider is configured for production.") } }
  }
  return outbox(process.env.OUTBOX_DIR ?? "data/outbox")
}

export function outbox(dir: string): Mailer {
  return {
    async send(mail) {
      mkdirSync(dir, { recursive: true })
      const name = `${new Date().toISOString().replace(/[:.]/g, "-")}-${mail.to.replace(/[^a-z0-9@.]/gi, "_")}.txt`
      writeFileSync(join(dir, name), `To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`)
      console.log(JSON.stringify({ event: "mail.outbox", to: mail.to, subject: mail.subject, file: name }))
    },
  }
}

export function memoryMailer(): Mailer & { sent: Mail[] } {
  const sent: Mail[] = []
  return { sent, async send(mail) { sent.push(mail) } }
}
