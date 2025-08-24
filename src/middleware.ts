import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  if (!token) {
    console.log('No authToken cookie found, redirecting to home.');
    return NextResponse.redirect(new URL('/', request.url));
  }
  console.log('authToken cookie found:', token);
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'], // protect this route
};
