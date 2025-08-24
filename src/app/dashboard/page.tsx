// app/dashboard/page.tsx
import HeaderUser from './HeaderUser';
import CustomerSearch from './CustomerSearch';

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex justify-between p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <HeaderUser />
      </header>

      <div className="max-w-xl mx-auto mt-10">
        <CustomerSearch />
      </div>
    </main>
  );
}
