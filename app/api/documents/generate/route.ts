import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type, companyProfile, clientData } = await req.json();

    const prompt = `
You are a professional business document generator.

Generate a ${type} in clean structured JSON format.

Company Details:
${JSON.stringify(companyProfile)}

Client Details:
${JSON.stringify(clientData)}

Return strictly in this JSON format:

{
  "title": "",
  "document_number": "",
  "date": "",
  "client_name": "",
  "client_company": "",
  "items": [
    {
      "description": "",
      "quantity": "",
      "unit_price": "",
      "total": ""
    }
  ],
  "subtotal": "",
  "tax": "",
  "grand_total": "",
  "terms": ""
}

Do not return explanations. Only valid JSON.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("AI Generate Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}