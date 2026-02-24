"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    industry: "",
    currentRevenue: "",
    targetRevenue: "",
    avgOrderValue: "",
  conversionRate: "",
  leadsPerMonth: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) alert(error.message);
    else router.push("/dashboard");
  };

  const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  if (!data.user) {
    alert("User creation failed.");
    return;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      industry: form.industry,
      current_revenue: Number(form.currentRevenue),
      target_revenue: Number(form.targetRevenue),
      avg_order_value: Number(form.avgOrderValue),
      conversion_rate: Number(form.conversionRate),
      leads_per_month: Number(form.leadsPerMonth),
    });

  if (profileError) {
    alert("Error saving profile: " + profileError.message);
    return;
  }

  router.push("/dashboard");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white">

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Build Your Growth System" : "Welcome Back"}
        </h1>

        {/* LOGIN MODE */}
        {!isSignup && (
          <>
            <input
              name="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-6 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleChange}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 p-3 rounded-lg hover:bg-purple-700 transition"
            >
              Login
            </button>
          </>
        )}

        {/* SIGNUP MODE */}
        {isSignup && (
          <>
            {step === 1 && (
              <>
                <input
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 mb-4 rounded-lg bg-white/10"
                  onChange={handleChange}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 mb-4 rounded-lg bg-white/10"
                  onChange={handleChange}
                />
                <input
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full p-3 mb-4 rounded-lg bg-white/10"
                  onChange={handleChange}
                />
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 p-3 rounded-lg"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
  <>
    <input
      name="businessName"
      placeholder="Business Name"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="industry"
      placeholder="Industry"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="currentRevenue"
      placeholder="Current Monthly Revenue (₹)"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="targetRevenue"
      placeholder="Target Monthly Revenue (₹)"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="avgOrderValue"
      placeholder="Average Order Value (₹)"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="conversionRate"
      placeholder="Conversion Rate (%)"
      className="w-full p-3 mb-4 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <input
      name="leadsPerMonth"
      placeholder="Leads Per Month"
      className="w-full p-3 mb-6 rounded-lg bg-white/10"
      onChange={handleChange}
    />

    <button
      onClick={handleSignup}
      className="w-full bg-green-600 p-3 rounded-lg hover:bg-green-700 transition"
    >
      Build My Growth System
    </button>
  </>
)}
          </>
        )}

        <div className="mt-6 text-center text-gray-400">
          {isSignup ? (
            <button onClick={() => setIsSignup(false)}>
              Already have an account? Login
            </button>
          ) : (
            <button onClick={() => setIsSignup(true)}>
              Create an account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}