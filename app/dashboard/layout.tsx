"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-gray-900 p-6 space-y-6">
        <h2 className="text-xl font-bold">Business Bhaiya</h2>

        <nav className="space-y-3">
          <Link href="/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/dashboard/sales-tracker" className="block hover:text-blue-400">
            Sales Tracker
          </Link>
         
         <Link
  href="/dashboard/sales-calling"
  className="block px-4 py-2 hover:bg-gray-800 rounded"
>
  Sales Calling
</Link>
         
         
         
          <Link
  href="/dashboard/tasks"
  className="block px-4 py-2 rounded hover:bg-gray-800"
>
  Tasks
</Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}