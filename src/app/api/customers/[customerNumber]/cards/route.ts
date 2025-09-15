// app/api/customers/[customerNumber]/cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { customerNumber: string } }
) {
  const { customerNumber } = params;

  try {
    // Retrieve token from cookies (set during login)
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    console.log('Using token:', token);


    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing token' },
        { status: 401 }
      );
    }

    // Call the external cards API
    const res = await fetch(
      `https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/customers/${customerNumber}/cards`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        
      }
      
    );

    const data = await res.json();

    console.log('Fetching cards from:', `https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/customers/${customerNumber}/cards`);
        console.log('Using token:', token);
        console.log('Cards API response status:', res.status);
        console.log('Cards API body:', res.json());        
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch cards' },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
      console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
