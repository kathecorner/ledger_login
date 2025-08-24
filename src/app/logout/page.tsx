// app/logout/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Logout() {
  //cookies().delete('authToken');
  redirect('/');
}
