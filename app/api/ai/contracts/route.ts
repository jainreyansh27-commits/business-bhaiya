import { NextResponse } from "next/server"

export async function POST(req:Request){

const {text} = await req.json()

const prompt = `
You are a legal assistant for business owners.

Analyze the following contract and explain it in simple terms.

Contract:

${text}

Provide:

1. Payment terms
2. Delivery conditions
3. Penalties
4. Liability clauses
5. Risk warnings
6. Simple summary
`

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
parts:[{text:prompt}]
}
]
})
}
)

const data = await res.json()

const result =
data?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis"

return NextResponse.json({result})

}