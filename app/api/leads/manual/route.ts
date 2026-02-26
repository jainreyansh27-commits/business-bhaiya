import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, company, userId } = body;

    // 🔍 Basic validation
    if (!name || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: name or userId" },
        { status: 400 }
      );
    }

    // 🚀 Insert into leads table
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          user_id: userId,
          name,
          phone,
          company,
          status: "pending",
        },
      ])
      .select();

    // ❌ Handle DB error properly
    if (error) {
      console.error("Insert Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // ✅ Success
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("API Error:", err);

    return NextResponse.json(
      { error: "Server error creating lead" },
      { status: 500 }
    );
  }
}