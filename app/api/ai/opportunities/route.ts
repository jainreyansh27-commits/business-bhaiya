import { NextResponse } from "next/server"

export async function POST(req: Request) {

  const { industry, product, location } = await req.json()

  const prompt = `
You are a B2B opportunity finder for small manufacturers.

Find potential buyer opportunities for:

Product: ${product}
Industry: ${industry}
Location: ${location}

List:

Company Name
Possible Requirement
Estimated Quantity
Where to find them (IndiaMART / TradeIndia / OEM / Export)

Give 8 opportunities.
`

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
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

  const data = await response.json()

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "No opportunities found."

  return NextResponse.json({ result: text })
}