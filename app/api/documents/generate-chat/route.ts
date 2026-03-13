import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = body?.prompt || "";
    const companyProfile = body?.companyProfile || {};
    const receiverDetails = body?.receiverDetails || {};

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt missing" },
        { status: 400 }
      );
    }

    // 🔹 Strict document generator prompt
    const structuredPrompt = `
You are a professional business document generator.

IMPORTANT RULES:
- Only generate the FINAL DOCUMENT.
- Do NOT give suggestions.
- Do NOT show templates.
- Do NOT show placeholders like [Company Name].
- Do NOT explain anything.
- The document must be ready to send.

COMPANY DETAILS:
Company Name: ${companyProfile.company_name || ""}
Address: ${companyProfile.address || ""}
Phone: ${companyProfile.phone || ""}
Email: ${companyProfile.email || ""}

RECEIVER DETAILS:
Name: ${receiverDetails.name || ""}
Company: ${receiverDetails.company || ""}
Address: ${receiverDetails.address || ""}

USER REQUEST:
${prompt}

Return ONLY the final formatted document text.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: structuredPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json(
        { error: "Gemini request failed" },
        { status: 500 }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty result" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: text,
    });

  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}