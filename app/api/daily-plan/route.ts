import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 🔥 Service role client (bypasses RLS completely)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      industry,
      revenueGap,
      ordersNeeded,
      leadsNeeded,
      userId,
    } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are Business Bhaiya — a practical Indian business execution mentor.

Industry: ${industry}
Revenue Gap: ₹${revenueGap}
Orders Needed: ${ordersNeeded}
Leads Needed: ${leadsNeeded}

Generate a sharp DAILY execution plan.
Max 5 bullet points.
Clear actions only.
No fluff.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 Insert directly (RLS bypassed)
const { error } = await supabase
  .from("daily_plans")
  .insert({
    user_id: userId,
    plan: text,
    completed: false,
    date: new Date().toISOString().split("T")[0], // required column
  });

    if (error) {
      console.error("Insert error:", error);
    }

    return NextResponse.json({
      plan: text,
    });
  } catch (error) {
    console.error("Daily Plan Error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily plan." },
      { status: 500 }
    );
  }
}