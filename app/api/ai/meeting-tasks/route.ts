import { NextResponse } from "next/server"

export async function POST(req: Request) {

const formData = await req.formData()

const notes = formData.get("notes") as string
const audio = formData.get("audio") as File | null

let parts:any[] = []

if(notes){
parts.push({
text: `
Convert these meeting notes into structured tasks.

Return format:

Task
Owner
Deadline

Notes:
${notes}
`
})
}

if(audio){

const bytes = await audio.arrayBuffer()

const base64 = Buffer.from(bytes).toString("base64")

parts.push({
inline_data:{
mime_type: audio.type,
data: base64
}
})

parts.push({
text:`
The uploaded audio is a business meeting recording.

1. Transcribe the meeting
2. Extract action items
3. Convert them into tasks

Return format:

Task
Owner
Deadline
`
})

}

const res = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts
}
]
})
}
)

const data = await res.json()

const tasks =
data?.candidates?.[0]?.content?.parts?.[0]?.text || "No tasks generated"

return NextResponse.json({tasks})

}