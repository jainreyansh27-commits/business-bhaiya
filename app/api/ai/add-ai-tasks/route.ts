import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(req:Request){

const {tasks} = await req.json()

const lines = tasks.split("\n")

const taskList = lines
.filter((l:string)=>l.toLowerCase().includes("task"))
.map((l:string)=>({
title:l.replace("Task:","").trim(),
completed:false
}))

await supabase
.from("tasks")
.insert(taskList)

return NextResponse.json({success:true})

}