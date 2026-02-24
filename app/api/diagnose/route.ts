import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      industry,
      currentRevenue,
      targetRevenue,
      avgOrderValue,
      leadsPerMonth,
      conversionRate,
    } = body;

    // ===== Calculations =====
    const revenueGap = targetRevenue - currentRevenue;

    const ordersNeeded =
      avgOrderValue > 0 ? revenueGap / avgOrderValue : 0;

    const leadsNeeded =
      conversionRate > 0
        ? ordersNeeded / (conversionRate / 100)
        : 0;

    // ===== Gemini Setup =====
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ===== Structured Prompt =====
 const prompt = `
You are a senior growth strategist with deep expertise in the ${industry} industry.
Assume you have worked 10+ years in this industry.
You must give INDUSTRY-SPECIFIC insights.
Do NOT give generic business advice.
Reference how growth typically works in this industry.

Business Details:
Industry: ${industry}
Current Monthly Revenue: ₹${currentRevenue}
Target Monthly Revenue: ₹${targetRevenue}
Revenue Gap: ₹${revenueGap}
Average Order Value: ₹${avgOrderValue}
Leads Per Month: ${leadsPerMonth}
Conversion Rate: ${conversionRate}%

Calculated Metrics:
Orders Needed: ${Math.ceil(ordersNeeded)}
Leads Needed: ${Math.ceil(leadsNeeded)}

Your job:
1. Identify the MAIN bottleneck preventing growth in THIS SPECIFIC industry.
2. Suggest 3 tactical actions relevant to this industry.
3. Give 1 serious risk warning specific to this industry.

Respond ONLY in JSON format like this:

{
  "bottleneck": "Industry-specific bottleneck explanation",
  "priority_this_week": [
    "Industry-specific action 1",
    "Industry-specific action 2",
    "Industry-specific action 3"
  ],
  "risk_warning": "Industry-specific risk"
}

No markdown.
No explanation.
Only raw JSON.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean Gemini markdown formatting if present
const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let parsed;

try {
  parsed = JSON.parse(cleaned);
} catch (error) {
  console.error("Gemini returned invalid JSON:", text);
  return new Response(
    JSON.stringify({ error: "Invalid AI response format" }),
    { status: 500 }
  );
}

    return new Response(
      JSON.stringify({
        revenueGap,
        ordersNeeded,
        leadsNeeded,
        ...parsed,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}