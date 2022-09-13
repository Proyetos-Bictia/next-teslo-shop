import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// import { jwt } from "../../utils";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!session) {
    const url = req.nextUrl.clone();
    return NextResponse.redirect(`${url.origin}/auth/login?p=${req.page.name}`)
  }

  return NextResponse.next();



  // const { token = '' } = req.cookies;
  // let isValidToken = false;

  // // return new Response('Token: ' + token)

  // try {
  //   await jwt.isValidToken(token);
  //   return NextResponse.next();
  // } catch (erro) {
  //   const url = req.nextUrl.clone();
  //   return NextResponse.redirect(`${url.origin}/auth/login?p=${req.page.name}`);
  // }
}
