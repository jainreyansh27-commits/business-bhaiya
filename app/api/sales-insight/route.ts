import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// 🔐 Create Supabase Admin Client (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🤖 Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      calls,
      meetings,
      closed,
      meetingRate,
      closingRate,
      overallConversion,
      userId,
    } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a high performance sales coach.

Analyze this sales data:

Calls: ${calls}
Meetings: ${meetings}
Closed: ${closed}
Meeting Rate: ${meetingRate}%
Closing Rate: ${closingRate}%
Overall Conversion: ${overallConversion}%

Return STRICT JSON only in this format:

{
  "assessment": "short performance summary",
  "improvement": "clear improvement advice",
  "action_task": "one very specific actionable task for today"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 Clean JSON (removes ```json formatting)
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // 📅 Insert AI Task into daily_tasks
    if (parsed.action_task && userId) {
      const today = new Date().toISOString().split("T")[0];

      await supabaseAdmin.from("daily_tasks").insert({
        user_id: userId,
        title: parsed.action_task,
        completed: false,
        date: today,
        source: "ai-sales",
      });
    }

    return NextResponse.json({
      insight:
        parsed.assessment +
        "\n\nImprovement: " +
        parsed.improvement,
    });
  } catch (error) {
    console.error("Sales Insight Error:", error);
    return NextResponse.json(
      { error: "Failed to generate sales insight." },
      { status: 500 }
    );
  }
}