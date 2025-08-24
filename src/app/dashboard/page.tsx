// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Dashboard() {
      const cookieStore = await cookies();
    const userName = cookieStore.get('userName')?.value || 'Guest';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
        <header className="flex justify-end p-4 bg-white shadow-md">
            <span className="text-gray-700 font-medium">Login as : {userName}</span>
        </header>
        <p></p>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        <p className="mt-4 text-gray-600">You are now logged in.</p>
        <Link
          href="/logout"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
    </main>
  );
}
