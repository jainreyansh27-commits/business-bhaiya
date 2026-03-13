import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request){

try{

const { command } = await req.json()

const prompt = `
You are an AI assistant inside a business management system.

User voice command:
"${command}"

Detect if the user wants to create a task.

Return ONLY JSON.

Example:

{
"action":"create_task",
"title":"Follow up with ABC panels tomorrow"
}

If nothing matches:

{
"action":"none"
}
`

const ai = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[{text:prompt}]
}
]
})
}
)

const data = await ai.json()

let text =
data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"

text = text.replace(/```json|```/g,"").trim()

let parsed

try{
parsed = JSON.parse(text)
}catch{
parsed = {action:"none"}
}

if(parsed.action === "create_task"){

await supabase.from("tasks").insert([
{
title: parsed.title,
completed:false
}
])

return NextResponse.json({
result:"Task created successfully"
})

}

return NextResponse.json({
result:"No task detected"
})

}catch(err){

console.error(err)

return NextResponse.json({
result:"Voice assistant failed"
})

}

}