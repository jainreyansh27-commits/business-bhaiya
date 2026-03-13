import { NextResponse } from "next/server"

export async function POST(req: Request) {

const formData = await req.formData()
const image = formData.get("image") as File

const bytes = await image.arrayBuffer()
const base64 = Buffer.from(bytes).toString("base64")

const res = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=" +
process.env.GEMINI_API_KEY,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{
text:`
The image may contain many business cards (10-30).

For EACH business card extract:

- name
- company
- phone
- email

Return ONLY JSON in this format:

{
"cards":[
{
"name":"",
"company":"",
"phone":"",
"email":""
}
]
}

If some fields are missing leave them empty.
`
},
{
inline_data:{
mime_type:image.type,
data:base64
}
}
]
}
]
})
}
)

const data = await res.json()

let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

text = text.replace(/```json|```/g,"").trim()

const parsed = JSON.parse(text)

return NextResponse.json(parsed)

}