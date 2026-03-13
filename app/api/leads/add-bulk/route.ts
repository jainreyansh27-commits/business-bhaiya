import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req:Request){

const {cards} = await req.json()

for(const c of cards){

await supabase.from("leads").insert({

name:c.name,
company:c.company,
phone:c.phone,
status:"pending",
source:"business_card"

})

}

return NextResponse.json({success:true})

}