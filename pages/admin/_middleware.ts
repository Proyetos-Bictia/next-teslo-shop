import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!session) {
    const url = req.nextUrl.clone();
    return NextResponse.redirect(`${url.origin}/auth/login?p=${req.page.name}`)
  }

  const validRoles = ['admin', 'super-user', 'SEO']

  if (!validRoles.includes(session.user.role)) {
    const url = req.nextUrl.clone();
    return NextResponse.redirect(`${url.origin}/`)
  }

  return NextResponse.next();
}
