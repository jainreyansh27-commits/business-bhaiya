import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalTasks, completedTasks, progress } = body;

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an elite execution coach for business founders.

Today's stats:

Total Tasks: ${totalTasks}
Completed Tasks: ${completedTasks}
Progress: ${progress}%

Analyse the performance.

Give:
1. Short performance assessment
2. Behavioural insight
3. One improvement action for tomorrow

Be direct. Be motivating. Keep it concise.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ insight: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}