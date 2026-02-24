"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [dailyPlan, setDailyPlan] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCheckIn = async () => {
    const today = new Date().toISOString().split("T")[0];

    if (profile.last_check_in === today) {
      alert("Already checked in today.");
      return;
    }

    let newStreak = 1;

    if (profile.last_check_in) {
      const lastDate = new Date(profile.last_check_in);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (
        lastDate.toISOString().split("T")[0] ===
        yesterday.toISOString().split("T")[0]
      ) {
        newStreak = profile.streak_count + 1;
      }
    }

    await supabase
      .from("profiles")
      .update({
        last_check_in: today,
        streak_count: newStreak,
      })
      .eq("id", profile.id);

    setProfile({
      ...profile,
      last_check_in: today,
      streak_count: newStreak,
    });
  // 🎉 ADD THIS BLOCK HERE
const milestones = [3, 7, 14, 30, 60, 100];

if (milestones.includes(newStreak)) {
  const confetti = (await import("canvas-confetti")).default;

  confetti({
    particleCount: newStreak >= 30 ? 300 : 150,
    spread: 120,
    origin: { y: 0.6 },

    });
}

};
const generatePlan = async () => {
  if (!profile) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const revenueGap =
    profile.target_revenue - profile.current_revenue;

  const ordersNeeded = Math.ceil(
    revenueGap / profile.avg_order_value
  );

  const leadsNeeded = Math.ceil(
    ordersNeeded / (profile.conversion_rate / 100)
  );

  const {
  data: { session },
} = await supabase.auth.getSession();

const res = await fetch("/api/daily-plan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    industry: profile.industry,
    revenueGap,
    ordersNeeded,
    leadsNeeded,
    userId: profile.id, // IMPORTANT
  }),
});

  const data = await res.json();

  setDailyPlan({
    plan: data.plan,
    completed: false,
  });
};
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  const revenueGap =
    profile.target_revenue - profile.current_revenue;

  const progress =
    (profile.current_revenue / profile.target_revenue) * 100;

  const ordersNeeded = Math.ceil(
    revenueGap / profile.avg_order_value
  );

  const leadsNeeded = Math.ceil(
    ordersNeeded / (profile.conversion_rate / 100)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Growth Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <h2 className="text-lg text-gray-400 mb-2">
          Revenue Progress
        </h2>
        <div className="w-full bg-gray-800 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          ₹{profile.current_revenue.toLocaleString()} of ₹
          {profile.target_revenue.toLocaleString()}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-gray-400">Revenue Gap</h2>
          <p className="text-2xl font-bold">
            ₹{revenueGap.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-gray-400">Orders Needed</h2>
          <p className="text-2xl font-bold">
            {ordersNeeded}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-gray-400">Leads Needed</h2>
          <p className="text-2xl font-bold">
            {leadsNeeded}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl">
          <h2 className="text-gray-400">Current Streak</h2>
          <p className="text-2xl font-bold text-yellow-400">
            🔥 {profile.streak_count || 0} Days
          </p>
        </div>
      </div>

      {/* Daily Check In */}
      <div className="bg-purple-600/20 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          Daily Execution Check-In
        </h2>

        <button
          onClick={handleCheckIn}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Check In Today
        </button>

        <p className="mt-3 text-sm text-gray-400">
          Build consistency. Growth compounds daily.
        </p>
      </div>
      {/* Daily Plan */}
<div className="mt-10 bg-blue-600/20 p-6 rounded-xl">
  <h2 className="text-lg font-semibold mb-4">
    Today's Action
  </h2>

  {!dailyPlan && (
    <button
      onClick={generatePlan}
      className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
    >
      Generate Today’s Plan
    </button>
  )}

  {dailyPlan && (
    <>
      <p className="text-gray-200 whitespace-pre-line">
        {dailyPlan.plan}
      </p>
    </>
  )}
</div>
    </div>
  );
}