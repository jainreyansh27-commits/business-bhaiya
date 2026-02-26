import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, newStatus, userId } = await req.json();

    if (!leadId || !newStatus || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Update lead status
    await supabaseAdmin
      .from("leads")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .eq("user_id", userId);

    // Determine sales_tracker update
    let calls = 0;
    let meetings = 0;
    let closed = 0;

    if (newStatus === "called_no_meeting") {
      calls = 1;
    }

    if (newStatus === "meeting") {
      calls = 1;
      meetings = 1;
    }

    if (newStatus === "closed") {
      closed = 1;
    }

    if (calls || meetings || closed) {
      await supabaseAdmin.from("sales_tracker").insert({
        user_id: userId,
        calls,
        meetings,
        closed,
        date: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}