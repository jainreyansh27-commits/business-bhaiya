import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { industry, revenueGap, ordersNeeded, leadsNeeded, userId } = body;

    // 🔥 Create Supabase client INSIDE function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a business growth assistant.
Industry: ${industry}
Revenue gap: ₹${revenueGap}
Orders needed: ${ordersNeeded}
Leads needed: ${leadsNeeded}

Generate a clear daily execution plan in simple steps.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const { error } = await supabase
      .from("daily_plans")
      .insert({
        user_id: userId,
        plan: text,
        completed: false,
        date: new Date().toISOString().split("T")[0],
      });

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: text });

  } catch (error) {
    console.error("Daily Plan Error:", error);
    return NextResponse.json(
      { error: "Failed to generate daily plan." },
      { status: 500 }
    );
  }
}