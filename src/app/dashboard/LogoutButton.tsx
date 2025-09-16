'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'GET' });
      if (res.ok) {
        router.push('/'); // or '/'
      } else {
        alert('Failed to logout. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('An error occurred during logout.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
