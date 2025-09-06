// app/api/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }

  try {
    const response = await fetch(
      'https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/logout',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Logout API failed' }, { status: response.status });
    }

    // Create a response and clear cookies using .cookies.set()
    const res = NextResponse.json({ message: 'Logged out successfully' });
    res.cookies.set('authToken', '', { maxAge: 0 });
    res.cookies.set('userName', '', { maxAge: 0 });

    return res;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
