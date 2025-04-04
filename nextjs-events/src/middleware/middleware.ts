import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value || localStorage.getItem('token');

  const protectedPaths = ['/dashboard', '/events', '/reservations'];
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/events/:path*', '/reservations/:path*'],
};
