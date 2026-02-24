"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import DiagnosisChat from "./components/DiagnosisChat";export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
const [showDiagnosis, setShowDiagnosis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");

  const { error } = await supabase
    .from("emails")
    .insert([{ email }]);

  if (error) {
  console.log(error);
}

  setSubmitted(true);
  setShowDiagnosis(true);
  setEmail("");
};

  return (
    <div className="relative text-white overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"></div>
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-600 opacity-20 blur-3xl rounded-full animate-float"></div>
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full animate-float-slow"></div>

      

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-24">
        <div className="max-w-4xl animate-fadeUp">

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Operating System for{" "}
            <span className="text-blue-400">Ambitious Businesses.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Turn annual revenue goals into structured weekly execution.
            Install clarity, discipline, and measurable growth into your business.
          </p>

         {!showDiagnosis ? (
  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="px-6 py-4 rounded-xl bg-white/10 border border-white/20"
    />

    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 transition px-6 py-4 rounded-xl"
    >
      Get Early Access
    </button>
  </form>
) : (
  <div className="mt-12">
    <DiagnosisChat />
  </div>
)}

          {error && (
            <div className="text-red-400 mt-4">{error}</div>
          )}

        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Most Businesses Don’t Lack Ambition.
            <br /> They Lack Structure.
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                Reactive Decisions
              </h3>
              <p className="text-gray-300">
                Growth is driven by urgency, not structured planning.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                No Execution Discipline
              </h3>
              <p className="text-gray-300">
                Goals are set annually, but never broken into weekly action.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                Inconsistent Growth
              </h3>
              <p className="text-gray-300">
                Some months perform well. Others collapse unexpectedly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-20">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Define the Goal
              </h3>
              <p className="text-gray-300">
                Set revenue targets and business priorities clearly.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Break into Weekly Execution
              </h3>
              <p className="text-gray-300">
                Turn long-term targets into structured weekly priorities.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Track & Adjust
              </h3>
              <p className="text-gray-300">
                Measure progress weekly and recalibrate automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-400 border-t border-white/10">
        © {new Date().getFullYear()} Business Bhaiya. All rights reserved.
      </footer>

    </div>
  );
}
