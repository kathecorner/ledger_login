// app/cards/[cardId]/page.tsx
import { cookies } from 'next/headers';

export default async function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const { cardId } = params;

  // Retrieve the authToken from cookies
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return <div className="p-6 text-red-500">Unauthorized: Missing token</div>;
  }

  // Call the secure API
  const response = await fetch(
    `https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/cards/${cardId}/secure`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return <div className="p-6 text-red-500">Failed to fetch card details</div>;
  }

  const cardDetails: Record<string, any> = await response.json();

  console.log(cardDetails.json());

  return (
<div className="p-6">
      <h1 className="text-xl font-bold mb-4">Card Secure Details</h1>
      <div className="bg-gray-100 p-4 rounded space-y-2">
        {Object.entries(cardDetails).map(([key, value]) => (
          <div key={key} className="border-b border-gray-300 py-2">
            <strong>{key}:</strong>{' '}
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
