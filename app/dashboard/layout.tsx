"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  BarChart3,
  Phone,
  CheckSquare,
  Zap,
  Target,
  FileText,
  Menu,
  X,
} from "lucide-react";
import VoiceAssistant from "../components/VoiceAssistant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/sales-tracker", label: "Sales Tracker", icon: BarChart3 },
    { href: "/dashboard/sales-calling", label: "Sales Calling", icon: Phone },
    { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/dashboard/ai-tools", label: "AI Tools", icon: Zap },
    { href: "/dashboard/opportunities", label: "Opportunities", icon: Target },
    { href: "/dashboard/documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden self-end mb-4 text-gray-400 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Logo/Brand */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Business Bhaiya
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Voice Assistant */}
        <div className="mt-auto">
          <VoiceAssistant />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-800 p-4 flex items-center justify-between">
          <button
            className="text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Business Bhaiya</h1>
          <div></div> {/* Spacer */}
        </header>

        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-gray-800 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}