// app/dashboard/CustomerSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  customerNumber: string;
  programName?: string;
  primaryPerson?: {
    firstName?: string;
    lastName?: string;
    dob?: string;
  };
}

interface Card {
  id: string;
  state?: string;
  type?: string;
  createdAt?: string;
  panFirst6?: string;
  panLast4?: string;
  expiry?: string;
  embossedName?: string;
  printedName?: string;
}

export default function CustomerSearch() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [history, setHistory] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const router = useRouter();

  // Load history from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem('customerSearchHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save history to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem('customerSearchHistory', JSON.stringify(history));
  }, [history]);

  const fetchCustomer = async (number: string) => {
    setLoading(true);
    setError(null);
    setCustomerData(null);
    setCards([]);

    try {
      const res = await fetch(`/api/customers/${number}`);
      console.log('Customer API response status:', res.status);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Customer not found');
      } else {
        setCustomerData(data);

        // Add to history if not already there
        setHistory((prev) => {
          const exists = prev.find((c) => c.customerNumber === data.customerNumber);
          if (exists) return prev;
          return [...prev.slice(-4), data]; // Keep only last 5
        });
      }
    } catch {
      setError('Failed to fetch customer');
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async (number: string) => {
    setLoadingCards(true);
    setCardError(null);
    setCards([]);

    try {
        console.log('Fetching cards for customer number:', number);
      const res = await fetch(`/api/customers/${number}/cards`);
      console.log('Cards API response status:', res.status);
      const data = await res.json();

      if (!res.ok) {
        setCardError(data.error || 'Failed to retrieve cards');
      } else {
        setCards(data || []);
      }
    } catch {
      setCardError('Error fetching cards');
    } finally {
      setLoadingCards(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNumber.trim()) return;
    fetchCustomer(customerNumber);
  };

  const handleCardClick = (card: Card) => {
    console.log(`You selected Card ID: ${card.id}`);
    router.push(`/cards/${card.id}`); // Navigate to a new page
    // This is where the next API call can be triggered in the future
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter customer number"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2 text-gray-700"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search 10000041390715'}
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-600">Recent Searches</h3>
          <ul className="mt-2 space-y-1">
            {history.map((c) => (
              <li key={c.customerNumber}>
                <button
                  onClick={() => fetchCustomer(c.customerNumber)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {c.customerNumber} — {c.primaryPerson?.firstName} {c.primaryPerson?.lastName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {customerData && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          <table className="min-w-full text-left border-collapse">
            <tbody>
              <tr>
                <th className="pr-4 py-1 text-gray-600">Customer Number:</th>
                <td>{customerData.customerNumber || 'N/A'}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600">Program Name:</th>
                <td>{customerData.programName || 'N/A'}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600">First Name:</th>
                <td>{customerData.primaryPerson?.firstName || 'N/A'}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600">Last Name:</th>
                <td>{customerData.primaryPerson?.lastName || 'N/A'}</td>
              </tr>
              <tr>
                <th className="pr-4 py-1 text-gray-600">Date of Birth:</th>
                <td>{customerData.primaryPerson?.dob || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <button
            onClick={() => fetchCards(customerData.customerNumber)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={loadingCards}
          >
            {loadingCards ? 'Loading Cards…' : 'Get Cards'}
          </button>
        </div>
      )}

      {cardError && <p className="mt-4 text-red-500">{cardError}</p>}

      {cards.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Available Cards</h3>
          <ul className="space-y-2">
            {cards.map((card) => (
              <li
                key={card.id}
                className="p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-blue-50"
                onClick={() => handleCardClick(card)}
              >
                <p><strong>Card ID:</strong> {card.id}</p>
                {card.state && <p><strong>Status:</strong> {card.state}</p>}
                {card.type && <p><strong>Type:</strong> {card.type}</p>}
                {card.panFirst6 && <p><strong>PAN First 6 Digits:</strong> {card.panFirst6}</p>}
                {card.panLast4 && <p><strong>PAN Last 4 Digits:</strong> {card.panLast4}</p>}
                {card.expiry && <p><strong>Expiry:</strong> {card.expiry}</p>}
                {card.embossedName && <p><strong>Embossed Name:</strong> {card.embossedName}</p>}
                {card.printedName && <p><strong>Printed Name:</strong> {card.printedName}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
