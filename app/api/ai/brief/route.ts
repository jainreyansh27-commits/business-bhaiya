import { NextResponse } from "next/server"

export async function POST(req: Request) {

try {

const { profile, sales, tasks } = await req.json()

const prompt = `
You are an AI business advisor helping a small business owner.

Business Info:
Owner: ${profile?.name}
Business: ${profile?.business_name}

Today's Data:

Revenue Target: ₹${profile?.target_revenue}
Current Revenue: ₹${sales?.revenue}

Sales Calls Made: ${sales?.calls}
Meetings Booked: ${sales?.meetings}
Deals Closed: ${sales?.deals}

Pending Tasks: ${tasks?.pending}

Generate a DAILY BUSINESS BRIEF with:

1. Revenue Status
2. Sales Activity
3. Key Insight
4. Top 3 Actions Today

Keep it short, practical, and motivational.
`

const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
contents: [
{
parts: [{ text: prompt }]
}
]
})
}
)

const data = await res.json()

const brief =
data?.candidates?.[0]?.content?.parts?.[0]?.text || "No briefing generated"

return NextResponse.json({ brief })

} catch (error) {

console.error(error)

return NextResponse.json(
{ error: "AI briefing failed" },
{ status: 500 }
)

}

}