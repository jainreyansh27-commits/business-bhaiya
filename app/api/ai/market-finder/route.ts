import { NextResponse } from "next/server"

export async function POST(req:Request){

const {industry,location,product} = await req.json()

const prompt = `
You are a business growth consultant.

Find NEW market opportunities.

Industry: ${industry}
Product: ${product}
Location: ${location}

Suggest:

1. New industries that may need this product
2. Types of companies to target
3. Market gaps
4. 10 potential buyer categories

Be practical for small manufacturers.
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
data?.candidates?.[0]?.content?.parts?.[0]?.text || "No result"

return NextResponse.json({result})

}