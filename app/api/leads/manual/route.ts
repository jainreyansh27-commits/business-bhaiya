import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, phone, company, userId } = await req.json();

    // 🔐 Validate required fields
    if (!userId || !name || name.trim() === "") {
      return NextResponse.json(
        { error: "Name and userId are required" },
        { status: 400 }
      );
    }

    // 🧠 Insert into leads table
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          phone: phone || "",
          company: company || "",
          status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error("Insert Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("Manual Route Server Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}