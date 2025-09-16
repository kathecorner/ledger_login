'use client';

import { useState } from 'react';

type searchParams = Promise<{
  pan: string;
  cvv2: string;
  expiry: string;
}>;

export default function PurchasePage({ searchParams }: { searchParams: { pan: string; cvv2: string; expiry: string } }) {
  const [form, setForm] = useState({
    acceptorAddress: '1-2-3 Shibuya',
    acceptorCity: 'Tokyo',
    acceptorCountryCode: 'JP',
    mcc: '4900',
    transactionType: 'Purchase',
    cardPresent: true,
    acquirerAmount: { amount: 1000, currencyCode: 'JPY' },
    billingAmount: { amount: 1000, currencyCode: 'JPY' },
    pan: searchParams.pan,
    cvv2: searchParams.cvv2,
    expiry: searchParams.expiry,
  });

  const [response, setResponse] = useState<unknown>(null);

  const handleChange = (e: unknown) => {
    const { name, value } = (e as React.ChangeEvent<HTMLInputElement>).target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Purchase Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['acceptorAddress', 'acceptorCity', 'acceptorCountryCode', 'mcc', 'transactionType'].map(field => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={(form as unknown)[field]}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        ))}
        <div>
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            name="acquirerAmount.amount"
            defaultValue={form.acquirerAmount.amount}
            className="border p-2 w-full rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Purchase
        </button>
      </form>

      {response && (
        <pre className="mt-6 p-4 bg-gray-100 rounded">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
