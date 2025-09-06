'use client';
import { useState, useRef, FormEvent, ChangeEvent, useEffect } from 'react';

export default function PurchaseForm({ cardDetails }: { cardDetails: Record<string, any> }) {
  const [showForm, setShowForm] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<Record<string, any> | null>(null);
  const [clearingResult, setClearingResult] = useState<Record<string, any> | null>(null);
  const [refundResult, setRefundResult] = useState<Record<string, any> | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(1500);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (purchaseResult || clearingResult || refundResult) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [purchaseResult, clearingResult, refundResult]);

  // Controlled form state
  const [formData, setFormData] = useState({
    acceptorAddress: '1-2-3 Shibuya',
    acceptorCity: 'Tokyo',
    acceptorCountryCode: 'JP',
    mcc: '4900',
    transactionType: 'Purchase',
    cardPresent: true,
    pan: cardDetails.pan || '',
    cvv2: cardDetails.cvv2 || '',
    expiry: cardDetails.expiry || '',
    acquirerAmount: 1000,
    acquirerCurrencyCode: 'JPY',
    billingAmount: 1000,
    billingCurrencyCode: 'JPY',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      acquirerAmount: {
        amount: Number(formData.acquirerAmount),
        currencyCode: formData.acquirerCurrencyCode,
      },
      billingAmount: {
        amount: Number(formData.billingAmount),
        currencyCode: formData.billingCurrencyCode,
      },
    };

    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Purchase failed: ${data.error || res.statusText}`);
        return;
      }

      setPurchaseResult(data);
      setClearingResult(null);
      setRefundResult(null);
      setRefundAmount(Number(formData.billingAmount)); // Default refund = billing amount
      //setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      console.error(err);
      alert('An error occurred during purchase.');
    }
  };

  const handleClearing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!purchaseResult) {
      alert('No purchase result found. Please run purchase first.');
      return;
    }

    const clearingPayload = {
      ...formData,
      acquirerAmount: {
        amount: Number(formData.acquirerAmount),
        currencyCode: formData.acquirerCurrencyCode,
      },
      billingAmount: {
        amount: Number(formData.billingAmount),
        currencyCode: formData.billingCurrencyCode,
      },
      originalMsgRequest: purchaseResult.requestMsg,
      originalMsgResponse: purchaseResult.responseMsg,
    };

    try {
      const res = await fetch('/api/clearing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clearingPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`Clearing failed: ${errorData.error || res.statusText}`);
        return;
      }

      const data = await res.json();
      setClearingResult(data);
      setRefundResult(null);
      //setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      console.error(err);
      alert('An error occurred during clearing.');
    }
  };

  const handleRefund = async () => {
    if (!purchaseResult) {
      alert('No purchase result found. Please run purchase first.');
      return;
    }

    const refundPayload = {
      ...formData,
      acquirerAmount: {
        amount: refundAmount,
        currencyCode: "JPY",
      },
      billingAmount: {
        amount: refundAmount,
        currencyCode: "JPY",
      },
      originalMsgRequest: purchaseResult.requestMsg,
      originalMsgResponse: purchaseResult.responseMsg,
    };

    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Refund failed: ${data.error || res.statusText}`);
        return;
      }

      setRefundResult(data);
      //setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      console.error(err);
      alert('An error occurred during refund.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Purchase & Clearing</h1>

      {!showForm && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleShowForm}
        >
          Make Purchase
        </button>
      )}

      {showForm && (
        <div ref={formRef} className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-bold mb-4">Purchase Form</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {[
              ['acceptorAddress', 'Acceptor Address'],
              ['acceptorCity', 'Acceptor City'],
              ['acceptorCountryCode', 'Acceptor Country Code'],
              ['mcc', 'MCC'],
              ['transactionType', 'Transaction Type'],
              ['pan', 'PAN'],
              ['cvv2', 'CVV2'],
              ['expiry', 'Expiry'],
              ['acquirerAmount', 'Acquirer Amount'],
              ['acquirerCurrencyCode', 'Acquirer Currency Code'],
              ['billingAmount', 'Billing Amount'],
              ['billingCurrencyCode', 'Billing Currency Code'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}

            <div>
              <label className="block font-medium mb-1">Card Present</label>
              <input
                type="checkbox"
                name="cardPresent"
                checked={formData.cardPresent}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-1/4">
                Submit Purchase
              </button>
            </div>
          </form>

          {purchaseResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded shadow">
              <h3 className="font-bold mb-2">Purchase Result</h3>
              <pre className="text-xs">{JSON.stringify(purchaseResult, null, 2)}</pre>
            </div>
          )}

          <form onSubmit={handleClearing} className="mt-6">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-1/4" >
              Clear Transaction
            </button>
          </form>

          {clearingResult && (
            <div className="mt-6 p-4 bg-green-50 rounded shadow">
              <h3 className="font-bold mb-2">Clearing Result</h3>
              <pre className="text-xs">{JSON.stringify(clearingResult, null, 2)}</pre>

              <div className="mt-4">
                <label className="block font-medium mb-1">Refund Amount</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={handleRefund}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-1/4"
                >
                  Initiate Refund
                </button>
              </div>
            </div>
          )}

          {refundResult && (
            <div className="mt-6 p-4 bg-yellow-50 rounded shadow">
              <h3 className="font-bold mb-2">Refund Result</h3>
              <pre className="text-xs">{JSON.stringify(refundResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
