// Builds: PR1
import { NextResponse, type NextRequest } from "next/server"
import { isAdmin } from "./admin"

export function proxy(req: NextRequest) {
  if (isAdmin(req.headers.get("authorization"))) return NextResponse.next()
  return new NextResponse("Operator area: sign in.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="operator"' } })
}

export const config = { matcher: ["/admin/:path*"] }
