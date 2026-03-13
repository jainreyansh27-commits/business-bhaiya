"use client"

import { useState } from "react"

export default function AIBrief({ profile, sales, tasks }: any) {

const [brief,setBrief] = useState("")
const [loading,setLoading] = useState(false)

async function generateBrief(){

setLoading(true)

const res = await fetch("/api/ai/brief",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
profile,
sales,
tasks
})
})

const data = await res.json()

setBrief(data.brief)

setLoading(false)

}

return (

<div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">

<div className="flex items-center justify-between mb-4">

<h2 className="text-xl font-semibold">
AI Business Brief
</h2>

<button
onClick={generateBrief}
className="bg-purple-600 px-4 py-2 rounded-lg text-sm"
>
{loading ? "Generating..." : "Generate Brief"}
</button>

</div>

{brief && (

<pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
{brief}
</pre>

)}

</div>

)

}