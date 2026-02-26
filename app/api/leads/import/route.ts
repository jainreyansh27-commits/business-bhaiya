import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leads, userId, source } = await req.json();

    if (!leads || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const formatted = leads.map((lead: any) => ({
      user_id: userId,
      name: lead.name,
      phone: lead.phone,
      company: lead.company,
      source: source || "csv",
      status: "pending",
    }));

    await supabaseAdmin.from("leads").insert(formatted);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json(
      { error: "Failed to import leads" },
      { status: 500 }
    );
  }
}