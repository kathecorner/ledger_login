import { cookies } from 'next/headers';
import PurchaseForm from './PurchaseForm';

export default async function CardDetailsPage({ params }: { params: { cardId: string } }) {
  const { cardId } = params;
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return <div className="p-6 text-red-500">Unauthorized: Missing token</div>;
  }

  const res = await fetch(
    `https://partner.dune1.euw-1.aws.tst.e6tech.net/restful/v1/cards/${cardId}/secure`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return <div className="p-6 text-red-500">Failed to fetch card details</div>;
  }

  const cardDetails = await res.json();

  return <PurchaseForm cardDetails={cardDetails} />;
}
