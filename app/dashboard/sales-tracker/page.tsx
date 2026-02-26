"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type Stats = {
  totalCalls: number;
  totalMeetings: number;
  totalClosed: number;
  meetingRate: string;
  closingRate: string;
  overallConversion: string;
};

const COLORS = ["#2563eb", "#f59e0b", "#16a34a"];

export default function SalesTracker() {
  /* ---------------- INPUT STATE ---------------- */
  const [calls, setCalls] = useState(0);
  const [meetings, setMeetings] = useState(0);
  const [closed, setClosed] = useState(0);

  /* ---------------- DATA STATE ---------------- */
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  /* ---------------- AI STATE ---------------- */
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  /* ---------------- FETCH DATA FUNCTION ---------------- */
  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date();

    // 🔥 Monday week start
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const { data: week } = await supabase
  .from("sales_tracker")
  .select("*")
  .eq("user_id", user.id)
  .gte("date", weekStart.toISOString().split("T")[0]);

const { data: month } = await supabase
  .from("sales_tracker")
  .select("*")
  .eq("user_id", user.id)
  .gte("date", monthStart.toISOString().split("T")[0]);

    setWeeklyData(week || []);
    setMonthlyData(month || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- CALCULATE STATS ---------------- */
  const calculateStats = (data: any[]): Stats => {
    const totalCalls = data.reduce((s, d) => s + d.calls, 0);
    const totalMeetings = data.reduce((s, d) => s + d.meetings, 0);
    const totalClosed = data.reduce((s, d) => s + d.closed, 0);

    return {
      totalCalls,
      totalMeetings,
      totalClosed,
      meetingRate:
        totalCalls > 0
          ? ((totalMeetings / totalCalls) * 100).toFixed(1)
          : "0",
      closingRate:
        totalMeetings > 0
          ? ((totalClosed / totalMeetings) * 100).toFixed(1)
          : "0",
      overallConversion:
        totalCalls > 0
          ? ((totalClosed / totalCalls) * 100).toFixed(1)
          : "0",
    };
  };

  const weeklyStats = calculateStats(weeklyData);
  const monthlyStats = calculateStats(monthlyData);

  /* ---------------- SAVE TODAY ---------------- */
  const saveToday = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("sales_tracker").insert({
  user_id: user.id,
  calls,
  meetings,
  closed,
  date: new Date().toISOString().split("T")[0],
});

    setCalls(0);
    setMeetings(0);
    setClosed(0);

    await fetchData(); // 🔥 instant refresh
  };

  /* ---------------- AI INSIGHT ---------------- */
  const generateInsight = async () => {
    setLoadingInsight(true);

    const res = await fetch("/api/sales-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calls: weeklyStats.totalCalls,
        meetings: weeklyStats.totalMeetings,
        closed: weeklyStats.totalClosed,
        meetingRate: weeklyStats.meetingRate,
        closingRate: weeklyStats.closingRate,
        overallConversion: weeklyStats.overallConversion,
      }),
    });

    const data = await res.json();
    setAiInsight(data.insight);
    setLoadingInsight(false);
  };

  /* ---------------- PIE DATA ---------------- */
  const pieData = [
    { name: "Calls", value: weeklyStats.totalCalls },
    { name: "Meetings", value: weeklyStats.totalMeetings },
    { name: "Closed", value: weeklyStats.totalClosed },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <h1 className="text-2xl font-semibold mb-6">📊 Sales Tracker</h1>

      {/* INPUTS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Input label="Calls Made Today" value={calls} setValue={setCalls} />
        <Input label="Meetings Booked Today" value={meetings} setValue={setMeetings} />
        <Input label="Deals Closed Today" value={closed} setValue={setClosed} />
      </div>

      {/* FUNNEL */}
      <div className="space-y-3 mb-8">
        <Bar label="Calls" value={calls} color="bg-blue-600" />
        <Bar label="Meetings" value={meetings} color="bg-yellow-500" />
        <Bar label="Closed" value={closed} color="bg-green-600" />
        <button
          onClick={saveToday}
          className="mt-4 bg-blue-600 px-6 py-2 rounded-lg"
        >
          Save Today’s Data
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <StatsBox title="This Week" stats={weeklyStats} />
        <StatsBox title="This Month" stats={monthlyStats} />
      </div>

      {/* PIE CHART */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-4">Funnel Breakdown</h2>
        {weeklyStats.totalCalls > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={110}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">No data yet</p>
        )}
      </div>

      {/* AI INSIGHT */}
      <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">🤖 AI Sales Insight</h2>
        <button
          onClick={generateInsight}
          className="bg-blue-600 px-4 py-2 rounded mb-3"
        >
          {loadingInsight ? "Analyzing..." : "Generate Insight"}
        </button>
        <p className="text-gray-300 whitespace-pre-line">{aiInsight}</p>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Input({ label, value, setValue }: any) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full mt-1 bg-gray-800 p-3 rounded"
      />
    </div>
  );
}

function Bar({ label, value, color }: any) {
  return (
    <div>
      <p className="text-sm mb-1">
        {label}: {value}
      </p>
      <div className="h-8 bg-gray-800 rounded">
        <div
          className={`${color} h-8 rounded transition-all`}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatsBox({ title, stats }: any) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h2 className="font-semibold mb-2">{title}</h2>
      <p>Calls: {stats.totalCalls}</p>
      <p>Meetings: {stats.totalMeetings}</p>
      <p>Closed: {stats.totalClosed}</p>
      <p className="text-sm text-gray-400 mt-2">
        Meeting Rate: {stats.meetingRate}%<br />
        Closing Rate: {stats.closingRate}%<br />
        Overall Conversion: {stats.overallConversion}%
      </p>
    </div>
  );
}