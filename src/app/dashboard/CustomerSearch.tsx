// app/dashboard/CustomerSearch.tsx
'use client';

import { useState } from 'react';

export default function CustomerSearch() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCustomerData(null);

    try {
      const res = await fetch(`/api/customers/${customerNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Customer not found');
      } else {
        setCustomerData(data);
      }
    } catch {
      setError('Failed to fetch customer');
    } finally {
      setLoading(false);
    }
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
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {customerData && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <pre className="mt-2 text-sm text-gray-700 overflow-auto">
            {JSON.stringify(customerData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
