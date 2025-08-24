// app/dashboard/HeaderUser.tsx
import { cookies } from 'next/headers';

export default async function HeaderUser() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value || 'Guest';

  return <span className="text-gray-700 font-medium">Hello, {userName}</span>;
}
