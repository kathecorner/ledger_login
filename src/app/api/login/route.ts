import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userName, password, partnerName } = await request.json();

    if (!userName || !password || !partnerName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const response = await fetch('https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, password, partnerName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    const token = data?.token || data?.accessToken || data?.tokenId || null; // adapt based on API response
    const res = NextResponse.json({ success: true });

    if (token) {
      res.cookies.set('authToken', token, {
        httpOnly: true, // prevents JS access
        secure: false, // only over HTTPS in production
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      // store username (readable by frontend)
      res.cookies.set('userName', userName, {
        httpOnly: false, // so frontend can read it
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
      });
      
    }
    console.log('Token set in cookie:', token);
    return res;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
