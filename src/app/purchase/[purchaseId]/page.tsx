// app/purchase/[purchaseId]/page.tsx
import { cookies } from 'next/headers';

interface PurchaseResponse {
  id: string;
  status?: string;
  [key: string]: unknown;
}

export default async function PurchaseResultPage({ params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params;

  // Retrieve authToken
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return <div className="p-6 text-red-500">Unauthorized: Missing token</div>;
  }

  try {
    // Fetch the purchase details from backend (replace with your real endpoint if needed)
    const res = await fetch(
      `https://paysim.dune1.euw-1.aws.tst.e6tech.net/restful/v1/payment/simulator/authorize/${purchaseId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return <div className="p-6 text-red-500">Failed to fetch purchase result: {text}</div>;
    }

    const purchaseData: PurchaseResponse = await res.json();

    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Purchase Result</h1>
        <p className="mb-4">Purchase ID: {purchaseId}</p>
        <div className="bg-gray-100 p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(purchaseData).map(([key, value]) => (
            <div key={key} className="border-b border-gray-300 pb-2">
              <strong className="block">{key}:</strong>
              <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err: unknown) {
    console.error(err);
    return <div className="p-6 text-red-500">Error: {String(err)}</div>;
  }
}
