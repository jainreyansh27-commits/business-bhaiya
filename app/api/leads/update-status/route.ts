import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { leadId, newStatus } = await req.json();

    if (!leadId || !newStatus) {
      return NextResponse.json(
        { error: "Missing leadId or newStatus" },
        { status: 400 }
      );
    }

    // 1️⃣ Get existing lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    const oldStatus = lead.status;
    const userId = lead.user_id;

    // 2️⃣ Update lead status
    const { error: updateError } = await supabaseAdmin
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // 3️⃣ Decide tracker increments
    let calls = 0;
    let meetings = 0;
    let closed = 0;

    if (oldStatus === "pending" && newStatus === "meeting") {
      calls = 1;
      meetings = 1;
    }

    if (oldStatus === "pending" && newStatus === "rejected") {
      calls = 1;
    }

    if (oldStatus === "meeting" && newStatus === "closed") {
      closed = 1;
    }

    // 4️⃣ Update sales_tracker if needed
    if (calls > 0 || meetings > 0 || closed > 0) {
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabaseAdmin
        .from("sales_tracker")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin
          .from("sales_tracker")
          .update({
            calls: (existing.calls || 0) + calls,
            meetings: (existing.meetings || 0) + meetings,
            closed: (existing.closed || 0) + closed,
          })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin
          .from("sales_tracker")
          .insert({
            user_id: userId,
            date: today,
            calls,
            meetings,
            closed,
          });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Update Status Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}