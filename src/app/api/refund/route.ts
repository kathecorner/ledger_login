import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(
      'https://paysim.dune1.euw-1.aws.tst.e6tech.net/restful/v1/payment/simulator/authorize',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    let returnData;
    try {
      returnData = await response.json();
    } catch {
      returnData = { message: 'No response from refund API' };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Refund API failed: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(returnData);
  } catch {
    return NextResponse.json({ error: 'Refund API call failed' }, { status: 500 });
  }
}
