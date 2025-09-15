import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {
      console.log('Auth Token:', token);
      console.log('Request Body at clearing API:', body);
    }

    const response = await fetch(
      'https://paysim.dune1.euw-1.aws.tst.e6tech.net/restful/v1/payment/simulator/clear',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${body.authToken}`, // If needed
        },
        body: JSON.stringify(body),
      }
    );

    // Get raw response first
    const rawText = await response.text();
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = { rawResponse: rawText }; // fallback if not JSON
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Clearing API failed: ${response.status}`, details: parsedData },
        { status: response.status }
      );
    }

    return NextResponse.json(parsedData, { status: response.status });
  } catch (error: string | any) {
    console.error('Clearing API error:', error);
    return NextResponse.json(
      { error: 'Clearing API failed', details: error.message },
      { status: 500 }
    );
  }
}
