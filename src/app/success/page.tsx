// app/success/page.tsx
export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-700">Login Successful!</h1>
        <p className="mt-4 text-gray-700">
          You have successfully logged in. Welcome!
        </p>
      </div>
    </main>
  );
}
