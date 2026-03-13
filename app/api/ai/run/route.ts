import { NextResponse } from "next/server"
import { runAI } from "@/lib/ai"

export async function POST(req: Request) {

const { prompt } = await req.json()

const result = await runAI(prompt)

return NextResponse.json({
result
})

}